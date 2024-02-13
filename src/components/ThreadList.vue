<template>
  <div class="col-full">
    <div class="thread-list">
      <h2 class="list-title">Threads</h2>

      <div class="thread" v-for="thread in threads" :key="thread.id">
        <div>
          <p>
            <a href="#">{{ thread.title }}</a>
          </p>
          <p class="text-faded text-xsmall">
            By <a href="profile.html">{{ userById(thread.userId).name }}</a
            >, {{ thread.publishedAt }}.
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
              <a href="profile.html">{{ userById(thread.userId).name }}</a>
            </p>
            <p class="text-xsmall text-faded">{{ thread.publishedAt }}</p>
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

<script setup lang="ts">
import { ref } from "vue";
import type Thread from "../types/Thread.ts";
import type User from "../types/User.ts";

import useSampleData from "../composables/useSampleData.ts";

const { threadsData, usersData } = useSampleData();

const threads = ref<Thread[]>(threadsData);
const users = ref<User[]>(usersData);

const userById = (userId: string | undefined): User => {
  const matchingUser = users.value.find((user) => user.id === userId);
  if (matchingUser === undefined) return {};

  return matchingUser;
};
</script>

<style scoped></style>
