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
                :alt="`${user?.name} profile picture`"
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
          @change="handleImageUpload"
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
        <span>{{ userPostsCount }} posts</span>
        <span>{{ userThreadsCount }} threads</span>
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
        <button @click.prevent="cancel" class="btn-ghost">Cancel</button>
        <button type="submit" class="btn-blue">Save</button>
      </div>
    </form>
  </div>
</template>

<script>
import { useRouteName } from "@/helpers/routeNameEnum";
/* eslint-disable */
const { RouteName } = useRouteName();
/* eslint-enable */

export default {
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      uploadingImage: false,
      editedUser: { ...this.user },
      avatarPreview: this.user.avatar,
    };
  },
  computed: {
    userPosts() {
      return this.$store.getters["posts/postsByUserId"](this.user.id);
    },
    userThreads() {
      return this.$store.getters["threads/threadsByUserId"](this.user.id);
    },
    userPostsCount() {
      return this.userPosts.length;
    },
    userThreadsCount() {
      return this.userThreads.length;
    },
  },
  methods: {
    saveProfile() {
      this.$store.dispatch("users/updateUser", { ...this.editedUser });
      this.$router.push({ name: RouteName.AccountShow });
    },
    cancel() {
      this.$router.push({ name: RouteName.AccountShow });
    },
    async handleImageUpload(event) {
      this.uploadingImage = true;
      const file = event.target.files[0];
      console.log("UserProfileCardEditor>handleImageUpload", file);
      this.editedUser.avatar = await this.$store.dispatch("auth/uploadAvatar", {
        userId: this.editedUser.id,
        avatar: file,
      });
      this.uploadingImage = false;
    },
  },
};
</script>
<style>
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

.content span {
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
