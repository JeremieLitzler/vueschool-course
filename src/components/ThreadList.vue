<template>
  <div>
    <div class="thread-list">
      <h2 class="list-title">Threads</h2>

      <p v-if="threads?.length === 0" class="no-threads">No threads yet.</p>
      <div
        v-else
        class="thread"
        v-for="thread in props.threads"
        :key="thread.id"
      >
        <div>
          <p>
            <router-link
              :to="{ name: 'ThreadShow', params: { id: thread.id } }"
            >
              {{ thread.title }}
            </router-link>
          </p>
          <p class="text-faded text-xsmall">
            By
            <router-link
              :to="{ name: 'UserShow', params: { id: thread.userId } }"
              >{{ getUserById(thread.userId).name }}</router-link
            >, <app-date :timestamp="thread.publishedAt!" />.
          </p>
        </div>

        <div class="activity">
          <p class="replies-count">
            {{ thread.repliesCount }} repl{{
              thread.repliesCount > 1 ? 'ies' : 'y'
            }}
          </p>

          <app-avatar-image
            cssClass="avatar-medium"
            :src="getUserById(thread.userId).avatar"
            :alt="`Avatar of ${getUserById(thread.userId).name}`"
          />

          <div>
            <p class="text-xsmall">
              <router-link
                :to="{ name: 'UserShow', params: { id: thread.userId } }"
                >{{ getUserById(thread.userId).name }}</router-link
              >
            </p>
            <p class="text-xsmall text-faded">
              <app-date :timestamp="thread.publishedAt!" />
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

<script setup lang="ts">
import ThreadHydraded from '@/types/ThreadHydraded';
import { useUserStore } from '@/stores/UserStore';

const props = defineProps<{
  threads: ThreadHydraded[];
}>();

const { getUserById } = useUserStore();
</script>

<style scoped>
.no-threads {
  text-align: center;
  padding: 1em;
  font-weight: bold;
}
</style>
