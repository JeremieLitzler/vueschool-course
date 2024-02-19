<template>
  <div class="col-full">
    <div class="thread-list">
      <h2 class="list-title">Threads</h2>

      <div class="thread" v-for="thread in threads" :key="thread.id">
        <div>
          <p>
            <RouterLink :to="{ name: 'ThreadShow', params: { id: thread.id } }"
              >{{ thread.title }}
            </RouterLink>
          </p>
          <p class="text-faded text-xsmall">
            By
            <router-link
              :to="{ name: 'UserShow', params: { id: thread.userId } }"
              >{{ userById(thread.userId).name }}</router-link
            >
            >, <app-date :timestamp="thread.publishedAt" />.
          </p>
        </div>

        <div class="activity">
          <p class="replies-count">
            {{ thread.posts.length }} repl{{
              thread.posts.length > 1 ? "ies" : "y"
            }}
          </p>

          <img
            class="avatar-medium"
            :src="userById(thread.userId).avatar"
            :alt="`Avatar of ${userById(thread.userId).name}`"
          />

          <div>
            <p class="text-xsmall">
              <router-link
                :to="{ name: 'UserShow', params: { id: thread.userId } }"
                >{{ userById(thread.userId).name }}</router-link
              >
            </p>
            <p class="text-xsmall text-faded">
              <app-date :timestamp="thread.publishedAt" />
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- <div class="pagination">
      <button class="btn-circle" disabled>
        <i class="fa fa-angle-left"></i>
      </button>
      1 of 3
      <button class="btn-circle"><i class="fa fa-angle-right"></i></button>
    </div> -->
  </div>
</template>

<script>
export default {
  props: {
    threads: {
      type: Array,
      required: true,
    },
  },
  computed: {
    posts() {
      return this.$store.state.posts;
    },
    users() {
      return this.$store.state.users;
    },
  },
  methods: {
    postById(postId) {
      const match = this.posts.find((post) => post.id === postId);
      //   console.log("postById", match);
      return match;
    },
    userById(userId) {
      const match = this.users.find((user) => user.id === userId);
      //   console.log("userById", match);
      return match;
    },
  },
};
</script>

<style lang="scss" scoped></style>
