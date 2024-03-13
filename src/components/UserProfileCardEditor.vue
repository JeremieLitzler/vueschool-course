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
                :src="editedUser.avatar"
                :alt="`${editedUser?.name} profile picture`"
                cssclass="avatar-xlarge img-update"
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
        <app-random-avatar-image-picker @hit="assignRandomAvatar" />
      </p>
      <app-form-field
        name="username"
        label="Username"
        v-model="editedUser.username"
        type="text"
        disabled
        cssClass="push-top text-lead text-bold"
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
        <span>{{ userPostsCount }} posts</span>
        <span>{{ userThreadsCount }} threads</span>
      </div>
      <hr />
      <app-form-field
        name="website"
        label="Website"
        v-model="editedUser.website"
        rules="url"
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
        autocomplete="off"
      />
      <div class="btn-group space-between">
        <button @click.prevent="cancel" class="btn-ghost">Cancel</button>
        <button type="submit" class="btn-blue">Save</button>
      </div>
    </vee-form>
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
      const { imageUrl } = await this.$store.dispatch("auth/uploadAvatar", {
        userId: this.editedUser.id,
        avatar: file,
      });
      this.editedUser.avatar = imageUrl || this.editedUser.avatar;
      this.uploadingImage = false;
    },
    async assignRandomAvatar(url) {
      this.uploadingImage = true;
      const response = await fetch(url);
      const blob = await response.blob();
      const { imageUrl } = await this.$store.dispatch("auth/uploadAvatar", {
        userId: this.editedUser.id,
        avatar: blob,
      });
      this.editedUser.avatar = imageUrl;
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
