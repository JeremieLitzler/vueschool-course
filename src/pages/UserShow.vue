<template>
  <app-loading-state v-if="!$store.getters.isAppIsReady" />
  <div v-else class="flex-grid">
    <div class="col-3 push-top">
      <user-profile-card v-if="!edit" :user="user" />
      <user-profile-card-editor v-else :user="user" />

      <p class="text-xsmall text-faded text-center">
        Member since june 2003, last visited 4 hours ago
      </p>
    </div>

    <div class="col-7 push-top">
      <div class="profile-header">
        <span class="text-lead"> {{ user?.name }}'s recent activity </span>
        <a href="#">See only started threads?</a>
      </div>

      <hr />

      <!-- <div class="activity-list">
        <div class="activity">
          <div class="activity-header">
            <img
              src="https://i.imgur.com/OqlZN48.jpg"
              alt=""
              class="hide-mobile avatar-small"
            />
            <p class="title">
              How can I chop onions without crying?
              <span>Joker started a topic in Cooking</span>
            </p>
          </div>

          <div class="post-content">
            <div>
              <p>
                I absolutely love onions, but they hurt my eyes! Is there a way
                where you can chop onions without crying?
              </p>
            </div>
          </div>

          <div class="thread-details">
            <span>4 minutes ago</span>
            <span>1 comments</span>
          </div>
        </div>

        <div class="activity">
          <div class="activity-header">
            <img
              src="http://i.imgur.com/s0AzOkO.png"
              alt=""
              class="hide-mobile avatar-small"
            />

            <p class="title">
              Wasabi vs horseraddish?
              <span>Joker replied to Robin's topic in Cooking</span>
            </p>
          </div>

          <div class="post-content">
            <div>
              <blockquote class="small">
                <div class="author">
                  <a href="/user/robin" class=""> robin</a>
                  <span class="time">a month ago</span>
                  <i class="fa fa-caret-down"></i>
                </div>

                <div class="quote">
                  <p>
                    Is horseradish and Wasabi the same thing? I&amp;#39;ve heard
                    so many different things.
                  </p>
                </div>
              </blockquote>

              <p>They're not the same!</p>
            </div>
          </div>

          <div class="thread-details">
            <span>2 days ago</span>
            <span>1 comment</span>
          </div>
        </div>

        <div class="activity">
          <div class="activity-header">
            <img
              src="https://i.imgur.com/OqlZN48.jpg"
              alt=""
              class="hide-mobile avatar-small"
            />
            <p class="title">
              Where is the sign in button??????!?!?!?!
              <span
                >Joker replied to his own topic in Questions & Feedback</span
              >
            </p>
          </div>

          <div class="post-content">
            <div>
              <p>
                <strong
                  ><i>Post deleted due to inappropriate language</i></strong
                >
              </p>
            </div>
          </div>

          <div class="thread-details">
            <span>7 days ago</span>
            <span>7 comments</span>
          </div>
        </div>
      </div> -->
      <post-list :posts="userPosts" />
    </div>
  </div>
</template>

<script>
import PostList from "@/components/PostList.vue";
import UserProfileCard from "@/components/UserProfileCard.vue";
import UserProfileCardEditor from "@/components/UserProfileCardEditor.vue";
//import { mapGetters } from "vuex";
export default {
  props: {
    id: {
      type: String,
    },
    edit: { type: Boolean, default: false },
  },
  data() {
    return {};
  },
  components: {
    PostList,
    UserProfileCard,
    UserProfileCardEditor,
  },
  computed: {
    user() {
      console.log("UserShow > user > id", this.id);
      if (this.id) {
        return this.$store.getters.getUser(this.id);
      }
      console.log(
        "UserShow > user > authUser getter",
        this.$store.getters.authUser
      );
      return this.$store.getters.authUser;
    },
    userPosts() {
      return this.$store.getters.postsByUserId(this.user.id);
    },
    userThreads() {
      return this.$store.getters.threadsByUserId(this.user.id);
    },
  },
  async created() {
    //get the authUser
    const userId = this.id ?? this.$store.getters.authUser.id;
    if (this.id) {
      await this.$store.dispatch("fetchUser", { id: this.id });
    } else {
      await this.$store.dispatch("fetchAuthUser");
    }

    //get the posts
    await this.$store.dispatch("fetchItemsByProp", {
      collectionName: "posts",
      whereProp: "userId",
      whereValue: userId,
    });
    //get the threads

    this.$store.dispatch("notifyAppIsReady");
  },
};
</script>
