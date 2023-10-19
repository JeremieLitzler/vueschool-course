<template>
  <div class="container">
    <div v-for="thread in threads" :key="thread.id" class="col-large push-top">
      <h1>{{ thread.title }}</h1>

      <div class="post-list">
        <div class="post" v-for="postId in thread.posts" :key="postId">
          <div class="user-info">
            <a href="#" class="user-name">{{ userById(postById(postId).userId).name }}</a>

            <a href="#">
              <img
                class="avatar-large"
                :src="userById(postById(postId).userId).avatar"
                :alt="userById(postById(postId).userId).name"
              />
            </a>

            <p class="desktop-only text-small">107 posts</p>
          </div>

          <div class="post-content">
            <div>
              <p>
                {{ postById(postId).text }}
              </p>
            </div>
          </div>

          <div class="post-date text-faded">
            {{ postById(postId).publishedAt }}
          </div>
        </div>
      </div>
    </div>
  </div>
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
