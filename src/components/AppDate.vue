<template>
  <span :title="readableDate">
    {{ elapsedTime }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);

const props = defineProps<{
  timestamp: number;
}>();

/**
 * Calculate the elapsed time
 * @returns {string}
 * @see https://day.js.org/docs/en/customization/relative-time#docsNav
 */
const elapsedTime = computed(() => {
  return dayjs.unix(props.timestamp).fromNow();
});
/**
 * Format the date to readable date.
 *
 * @returns {string}
 * @see https://day.js.org/docs/en/display/format#list-of-localized-formats
 */
const readableDate = computed(() => {
  return dayjs.unix(props.timestamp).format('ddd, MMM D, YYYY hh:mm');
});
</script>

<style scoped></style>
