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
        name="email"
        label="Email"
        v-model="editedUser.email"
        disabled
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

      <div class="btn-group space-between">
        <button @click.prevent="cancelEdit" class="btn-ghost">Cancel</button>
        <button type="submit" class="btn-blue">Save</button>
      </div>
    </vee-form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCommonStore } from '@/stores/CommonStore';
import { useUserStore } from '@/stores/UserStore';
import uniqueIdHelper from '@/helpers/uniqueIdHelper';
import { RouteName } from '@/enums/RouteName';
import type User from '@/types/User';
import type FileUploadEvent from '@/types/FileUploadEvent';
import type Country from '@/types/Country';

const { getUserById, updateUser } = useUserStore();
const router = useRouter();

defineOptions({
  inheritAttrs: false,
});

const props = defineProps<{
  user: User;
}>();

const uploadingImage = ref(false);
const newAvatar = ref<File | null>(null);
const appAvatarImageCompKey = ref(uniqueIdHelper().newUniqueId);
const user = computed(() => getUserById(props.user.id));
const editedUser = ref({ ...user.value });
console.log(editedUser);

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
const exitEditRoute = () => {
  router.push({ name: RouteName.AccountShow });
};
/**
 * Loads the image selected in the file system
 */
const handleFileUpload = async (event: Event) => {
  const fileUploadEvent = event as FileUploadEvent;
  uploadingImage.value = true;
  const file = fileUploadEvent.target.files[0];
  //console.log('UserProfileCardEditor>handleImageUpload', file);
  const url = await useCommonStore().uploadImageToStorage({
    userId: editedUser.value.id,
    image: file,
  });
  //console.log('UserProfileCardEditor>handleFileUpload>url', url);

  editedUser.value.avatar = url || editedUser.value.avatar;
  uploadingImage.value = false;
  //editedUser.value.avatar isn't reactive...
  //you have to save and refresh to see the new image...
  //unless you assign to the compoment a unique key on each upload
  appAvatarImageCompKey.value = uniqueIdHelper().newUniqueId;
};

const assignRandomAvatar = async (url: string) => {
  //console.log('assignRandomAvatar>url', url);
  uploadingImage.value = true;
  const response = await fetch(url);
  const blob = await response.blob();
  const firebaseUrl = await useCommonStore().uploadImageToStorage({
    userId: editedUser.value.id,
    image: blob as File,
  });
  editedUser.value.avatar = firebaseUrl || editedUser.value.avatar;
  uploadingImage.value = false;
  //console.log('assignRandomAvatar>editedUser', editedUser.value);
  //editedUser.value.avatar isn't reactive...
  //you have to save and refresh to see the new image...
  //unless you assign to the compoment a unique key on each upload
  appAvatarImageCompKey.value = uniqueIdHelper().newUniqueId;
};

const saveProfile = async () => {
  console.log('saveProfile>editedUser', editedUser.value);
  //console.log('saveProfile>newAvatar', newAvatar.value);

  await updateUser({
    userUpdated: editedUser.value,
    id: user.value.id,
    updatedAvatar: newAvatar.value!,
  });
  exitEditRoute();
};

const cancelEdit = () => {
  exitEditRoute();
};
</script>

<style scoped>
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
