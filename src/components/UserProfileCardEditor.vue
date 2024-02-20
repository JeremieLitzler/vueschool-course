<template>
  <div class="profile-card">
    <form @submit.prevent="saveProfile">
      <p class="text-center">
        <img
          :src="user.instance!.avatar"
          :alt="`${user.instance!.name} profile picture`"
          class="avatar-xlarge img-update"
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
        <button class="btn-ghost">Cancel</button>
        <button type="submit" class="btn-blue">Save</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useUserStore } from '@/stores/UserStore';
import User from '@/types/User';
const { getUserById, updateUser } = useUserStore();

const props = defineProps<{
  user: User;
}>();

const user = computed(() => getUserById(props.user.id));
const editedUser = { ...user.value.instance };

const saveProfile = () => {
  updateUser({ ...editedUser });
};
</script>

<style scoped></style>
