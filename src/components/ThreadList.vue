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
            By <a href="profile.html">{{ getUserById(thread.userId).name }}</a
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
            :src="getUserById(thread.userId).avatar"
            :alt="`Avatar of ${getUserById(thread.userId).name}`"
          />

          <div>
            <p class="text-xsmall">
              <a href="profile.html">{{ getUserById(thread.userId).name }}</a>
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
import useSampleData from "../composables/useSampleData.ts";
import useUser from "../composables/useUser";

const { getUserById } = useUser();
const { threadsData } = useSampleData();

const threads = ref<Thread[]>(threadsData);
</script>

<style scoped></style>
../composables/useUser.ts
