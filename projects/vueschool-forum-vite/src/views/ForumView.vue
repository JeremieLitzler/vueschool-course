<template>
  <h1>What's new on the forum?</h1>
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

<script setup>
import sourceData from '@/data.json'
//Use reactive for objects or arrays
//Use ref for other types (bool, primitives, ...)
// => in this case, add ".value" to ref() variables.
import { reactive /*ref*/ } from 'vue'

const threads = reactive(sourceData.threads)
const posts = reactive(sourceData.posts)
const users = reactive(sourceData.users)

function postById(postId) {
  return posts.find((post) => post.id === postId)
}

function userById(userId) {
  return users.find((user) => user.id === userId)
}
</script>

<style lang="scss" scoped></style>
