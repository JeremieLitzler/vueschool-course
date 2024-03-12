<template>
  <div class="profile-card">
    <form @submit.prevent="saveProfile">
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
              <img
                :src="editedUser.avatar"
                :alt="`${editedUser.name} profile picture`"
                class="avatar-xlarge img-update"
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
      </p>

      <div class="form-group">
        <input
          type="text"
          v-model="editedUser.username"
          placeholder="Username"
          class="form-input text-lead text-bold"
        />
      </div>

      <div class="form-group">
        <input
          type="text"
          v-model="editedUser.name"
          placeholder="Full Name"
          class="form-input text-lead"
        />
      </div>

      <div class="form-group">
        <label for="user_bio">Bio</label>
        <textarea
          v-model="editedUser.bio"
          class="form-input"
          id="user_bio"
          placeholder="Write a few words about yourself."
        ></textarea>
      </div>

      <div class="stats">
        <span>{{ user.postsCount! }} posts</span>
        <span>{{ user.threadsCount! }} threads</span>
      </div>

      <hr />

      <div class="form-group">
        <label class="form-label" for="user_website">Website</label>
        <input
          autocomplete="off"
          class="form-input"
          id="user_website"
          v-model="editedUser.website"
        />
      </div>

      <div class="form-group">
        <label class="form-label" for="user_email">Email</label>
        <input
          autocomplete="off"
          class="form-input"
          id="user_email"
          v-model="editedUser.email"
        />
      </div>

      <div class="form-group">
        <label class="form-label" for="user_location">Location</label>
        <input
          autocomplete="off"
          class="form-input"
          id="user_location"
          v-model="editedUser.location"
        />
      </div>

      <div class="btn-group space-between">
        <button @click="cancelEdit" class="btn-ghost">Cancel</button>
        <button type="submit" class="btn-blue">Save</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { RouteName } from '@/enums/RouteName';
import { useUserStore } from '@/stores/UserStore';
import User from '@/types/User';
import type FileUploadEvent from '@/types/FileUploadEvent';
import { useCommonStore } from '@/stores/CommonStore';

const { getUserById, updateUser } = useUserStore();
const router = useRouter();

const props = defineProps<{
  user: User;
}>();

const uploadingImage = ref(false);
const newAvatar = ref<File | null>(null);

const user = computed(() => getUserById(props.user.id));
const editedUser = { ...user.value };

const exitEditRoute = () => {
  //console.log('exitEditRoute', router);

  router.push({ name: RouteName.AccountShow });
};

const handleFileUpload = async (event: Event) => {
  const fileUploadEvent = event as FileUploadEvent;
  uploadingImage.value = true;
  const file = fileUploadEvent.target.files[0];
  console.log('UserProfileCardEditor>handleImageUpload', file);
  const url = await useCommonStore().uploadImageToStorage({
    userId: editedUser.id,
    image: file,
  });
  editedUser.avatar = url || editedUser.avatar;
  uploadingImage.value = false;
};

const saveProfile = () => {
  updateUser({
    userUpdated: editedUser,
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
