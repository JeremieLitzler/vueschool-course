<template>
  <div>Home page</div>
  <section v-for="thread in threads" :key="thread.id">
    <h2>{{ thread.title }}</h2>
    <article v-for="postId in thread.posts" :key="postId">
      <p>
        <em
          ><strong>
            {{ userById(postById(postId).userId).name }}
          </strong>
        </em>
      </p>
      <p>{{ postById(postId).text }}</p>
    </article>
  </section>
</template>

<script>
import sourceData from "@/data.json";
export default {
  data() {
    return {
      threads: sourceData.threads,
      posts: sourceData.posts,
      users: sourceData.users,
    };
  },
  methods: {
    postById(postId) {
      return this.posts.find((post) => post.id === postId);
    },
    userById(userId) {
      return this.users.find((user) => user.id === userId);
    },
  },
};
</script>

<style lang="scss" scoped></style>
