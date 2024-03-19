<template>
  <div class="profile-card">
    <vee-form @submit="saveProfile">
      <p class="text-center">
        <label
          aria-labelledby="avatar-change"
          for="avatar"
          class="avatar-label"
        >
          <div class="wrapper avatar-xlarge">
            <div id="avatar-change" class="content">
              <app-spinner v-if="uploadingImage" backgroundColor="#ffffff" />
              <span v-else>Modify 📷</span>
            </div>
            <div class="underlay">
              <app-avatar-image
                :key="appAvatarImageCompKey"
                :src="editedUser.avatar"
                :alt="`${editedUser.name} profile picture`"
                cssClass="avatar-xlarge img-update"
              />
            </div>
          </div>
        </label>
        <input
          v-show="false"
          type="file"
          id="avatar"
          accept="image/*"
          @change="handleFileUpload"
        />
        <app-random-avatar-image-picker @@hit="assignRandomAvatar" />
      </p>
      <app-form-field
        name="username"
        label="Username"
        v-model="editedUser.username"
        type="text"
        disabled
        cssClass="text-lead text-bold"
      />
      <app-form-field
        name="name"
        label="Full Name"
        v-model="editedUser.name"
        rules="required|min:3"
        type="text"
        cssClass="text-lead"
      />
      <app-form-field
        as="textarea"
        name="bio"
        label="Bio"
        v-model="editedUser.bio"
        placeholder="Write a few words about yourself."
      />
      <div class="stats">
        <span>{{ user.postsCount! }} posts</span>
        <span>{{ user.threadsCount! }} threads</span>
      </div>

      <hr />

      <app-form-field
        name="website"
        label="Website"
        rules="url"
        v-model="editedUser.website"
        autocomplete="off"
      />
      <app-form-field
        name="email_editor"
        label="Email"
        v-model="editedUser.email"
        :rules="`required|email|unique:users,email,${editedUser.email}`"
      />
      <app-form-field
        name="location"
        label="Location"
        v-model="editedUser.location"
        @mouseenter="loadCountries()"
        list="countries"
      />
      <datalist id="countries">
        <option
          v-for="country in countries"
          :key="country.name.common"
          :value="country.name.common"
        />
      </datalist>

      <app-spinner v-if="!asyncElementReady" />
      <div class="btn-group space-between">
        <button @click.prevent="cancelEdit" class="btn-ghost btn-small">
          Cancel
        </button>
        <button
          v-if="emailChanged && !emailVerified"
          :disabled="emailVerificationSent"
          @click.prevent="verifyEmail"
          class="btn-red btn-small"
        >
          Save and verify
        </button>
        <button
          v-else
          :disabled="emailChanged"
          type="submit"
          class="btn-blue btn-small"
        >
          Save
        </button>
      </div>
      <p
        v-if="emailChanged && !emailVerified"
        class="block-message block-message-warning"
      >
        Clicking <i>"Save and verify"</i> will update your profile and send you
        a verification link to the updated email address.
        <b>You must use the link to complete the process</b> to avoid
        desynchronisation of your account. Thank you 👍.
      </p>
    </vee-form>
    <!-- TODO: Not working: see script setup of the 
      component UserProfileCardEditorReauthenticate
    -->
    <!-- <user-profile-card-editor-reauthenticate
      :key="reauthCompKey"
      :display-modal="newAuthNeeded"
      @@logged-back="verifyEmail"
    /> -->
    <!-- Instead, I had to copy the code of the component
         UserProfileCardEditorReauthenticate here so that
         focus trap worked correctly with the dialog.
    -->
    <dialog ref="nativeDialogEl" class="modal-overlay">
      <section class="modal-content">
        <form method="dialog">
          <button
            class="btn-close btn-small btn-red"
            aria-label="Click or Hit ESC"
            title="Click or Hit ESC"
          >
            Cancel
          </button>
        </form>
        <article>
          <h3>You're authentication cookie is too old 😟</h3>
          <p>Please enter your credentials again 🗝️</p>
          <app-login-form
            :errorMessage="errorMessage"
            :enable-register="false"
            @@login="login"
          />
        </article>
      </section>
    </dialog>
    <!-- </section> -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useCommonStore } from '@/stores/CommonStore';
import { useUserStore } from '@/stores/UserStore';
import useNotification from '@/composables/useNotification';
import uniqueIdHelper from '@/helpers/uniqueIdHelper';
import { getQueryStringValue } from '@/helpers/queryStringHelper';
import firebaseService from '@/services/firebaseService';
import type { FirebaseError } from 'firebase/app';
import type FileUploadEvent from '@/types/FileUploadEvent';
import type Country from '@/types/Country';
import type User from '@/types/User';
import type UserLoginRequest from '@/types/UserLoginRequest';
import { RouteName } from '@/enums/RouteName';
import { AppQueryStringParam } from '@/enums/AppQueryStringParam';
import { NotificationType } from '@/enums/NotificationType';
import firebaseStorageService from '@/services/firebaseStorageService';
// import UserProfileCardEditorReauthenticate from '@/components/UserProfileCardEditorReauthenticate.vue';

const { getUserById, updateUser } = useUserStore();
const router = useRouter();

defineOptions({
  inheritAttrs: false,
});

const props = defineProps<{
  user: User;
}>();

const route = useRoute();
const asyncElement = 'UserProfileCardEditor';
const asyncElementReady = computed(() =>
  useCommonStore().isUiElementReady(asyncElement)
);
const uploadingImage = ref(false);
const newAvatar = ref<File | null>(null);
const appAvatarImageCompKey = ref(uniqueIdHelper().newUniqueId);
const user = computed(() => getUserById(props.user.id));
const editedUser = ref({ ...user.value });
const emailChanged = computed(
  () => user.value.email !== editedUser.value.email
);
const emailVerificationSent = ref(false);
const emailVerified = ref(false);
const newEmailVerified = getQueryStringValue(
  route.query,
  AppQueryStringParam.verifiedEmail
);

/**
 * List of countries
 * @see Country interface
 */
const countries = ref<Country[]>([]);
/**
 * prevent the restcountries to be fetch twice, in the UserProfileCardEditor and AppFormField.
 */
const fetchingCountries = ref(false);
/**
 * Loads the countries from restcountries API into the countries data prop.
 * If the countries data prop has a length, we do not fetch it again
 * If the countries are being fetched already, let's skip a second unnecessary fetch.
 */
const loadCountries = async () => {
  if (countries.value.length) return;
  if (fetchingCountries.value) return;

  fetchingCountries.value = true;
  const response = await fetch('https://restcountries.com/v3/all');
  countries.value = (await response.json()) as Country[];
  fetchingCountries.value = false;
};

/**
 * Handle the click on Cancel button
 */
const exitEdit = (cancelling: boolean = false) => {
  cleanUselessImages(cancelling);
  if (emailVerified.value) {
    router.push({
      name: RouteName.AccountShow,
      query: { emailWasVerified: 'true' },
    });

    return;
  }
  router.push({ name: RouteName.AccountShow });
};
/**
 * Remove all uploaded images that are not used.
 * For the Cancel action, it is all of them.
 * For the Update actionm it is all but the last one.
 */
const cleanUselessImages = (cancelling: boolean = false) => {
  console.log('cleanUselessImages>all', uploadedImages.value);
  const images = cancelling
    ? [...uploadedImages.value]
    : [...uploadedImages.value].splice(0, uploadedImages.value.length - 1);

  console.log('cleanUselessImages>filtered', images);
  images.forEach((image) => {
    firebaseStorageService().deleteFile(image);
  });
};

const uploadedImages = ref<string[]>([]);
/**
 * Loads the image selected in the file system.
 */
const handleFileUpload = async (event: Event) => {
  const fileUploadEvent = event as FileUploadEvent;
  uploadingImage.value = true;
  const file = fileUploadEvent.target.files[0];
  const { url, notification } =
    await firebaseStorageService().uploadImageToStorage({
      userId: editedUser.value.id,
      image: file,
    });
  if (url) uploadedImages.value.push(url);
  useNotification().addNotification(notification!);

  editedUser.value.avatar = url || editedUser.value.avatar;
  uploadingImage.value = false;
  //editedUser.value.avatar isn't reactive...
  //you have to save and refresh to see the new image...
  //unless you assign to the compoment a unique key on each upload
  appAvatarImageCompKey.value = uniqueIdHelper().newUniqueId;
};
/**
 * Loads a random image from picsum.photos into the avatar.
 */
const assignRandomAvatar = async (randomUrl: string) => {
  uploadingImage.value = true;
  const response = await fetch(randomUrl);
  const blob = await response.blob();
  const { url, notification } =
    await firebaseStorageService().uploadImageToStorage({
      userId: editedUser.value.id,
      image: blob as File,
    });
  if (url) uploadedImages.value.push(url);
  useNotification().addNotification(notification!);

  editedUser.value.avatar = url || editedUser.value.avatar;
  uploadingImage.value = false;
  //console.log('assignRandomAvatar>editedUser', editedUser.value);
  //editedUser.value.avatar isn't reactive...
  //you have to save and refresh to see the new image...
  //unless you assign to the compoment a unique key on each random pick
  appAvatarImageCompKey.value = uniqueIdHelper().newUniqueId;
};

const saveProfile = async () => {
  useCommonStore().notifyAsyncUiElementState({ uiElement: asyncElement });

  //console.log('saveProfile>editedUser', editedUser.value);
  //console.log('saveProfile>newAvatar', newAvatar.value);

  await updateUser({
    userUpdated: editedUser.value,
    id: user.value.id,
    updatedAvatar: newAvatar.value!,
  });
  useCommonStore().notifyAsyncUiElementState({
    uiElement: asyncElement,
    ready: true,
  });

  exitEdit();
};

const cancelEdit = () => {
  exitEdit(true);
};

const verifyEmail = async () => {
  useCommonStore().notifyAsyncUiElementState({ uiElement: asyncElement });
  const result = await firebaseService().secureUpdateEmail(
    editedUser.value.email!
  );
  if (!result.success) {
    useCommonStore().notifyAsyncUiElementState({
      uiElement: asyncElement,
      ready: true,
    });
    return reauthenticateWithLoginAndPassword();
  }
  useNotification().addNotification({
    message: `Please check the inbox of ${editedUser.value.email} and
        follow the instructions.`,
    type: NotificationType.Warning,
  });
  emailVerificationSent.value = true;
  await saveProfile();
  useCommonStore().notifyAsyncUiElementState({
    uiElement: asyncElement,
    ready: true,
  });
};

const reauthenticateWithLoginAndPassword = () => {
  showNativeDialog();
};

if (newEmailVerified) {
  editedUser.value.email = newEmailVerified;
  emailVerified.value = true;
  await saveProfile();
}

const errorMessage = ref('');

const login = async (request: UserLoginRequest) => {
  //console.log(form.value);
  const result = await useUserStore().loginWithEmailAndPassword({
    ...request,
  });
  const error = result as FirebaseError;
  if (error['name'] === 'FirebaseError') {
    errorMessage.value = error.message;
  } else {
    console.log('Reauthenticated successfully!');
    hideNativeDialog();
    verifyEmail();
  }
};

const nativeDialogEl = ref<HTMLDialogElement | null>(null);
const showNativeDialog = () => {
  console.log(
    'UserProfileCardEditorReauthenticate>showNativeDialog>nativeDialogEl',
    nativeDialogEl.value
  );
  nativeDialogEl.value?.showModal();
  console.log(
    'UserProfileCardEditorReauthenticate>showNativeDialog>showModal called'
  );
};
const hideNativeDialog = () => nativeDialogEl.value?.close();
</script>

<style scoped>
.reauthenticate-modal-wrapper {
  width: 100vw;
  height: 100vh;
}
.wrapper {
  cursor: pointer;
  display: flex;
  justify-content: center;
  margin: 1em auto;
  background: lightgrey;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  position: relative;
  font-weight: bold;
}

.content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: end;
}

.content * {
  font-size: 1.4em;
  color: white;
  margin-bottom: 1.2em;
  background-color: rgba(0, 0, 0, 0.25);
  padding: 0.25em 0.25em;
}

.underlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 100em;
}

.underlay img {
  background-position: cover;
}
</style>
