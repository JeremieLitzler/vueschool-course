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
import { Timestamp } from 'firebase/firestore';

dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);

const { timestamp } = defineProps<{
  timestamp?: number | Timestamp;
}>();

/**
 * Normalize the date that can be either the import data and the firestore timestamp
 */
const normalizedTimestamp = computed((): number => {
  const isTimestampType = timestamp as Timestamp;
  if (isTimestampType) {
    return isTimestampType.seconds;
  }
  return timestamp as number;
});
/**
 * Calculate the elapsed time
 * @returns {string}
 * @see https://day.js.org/docs/en/customization/relative-time#docsNav
 */
const elapsedTime = computed(() => {
  return dayjs.unix(normalizedTimestamp.value!).fromNow();
});
/**
 * Format the date to readable date.
 *
 * @returns {string}
 * @see https://day.js.org/docs/en/display/format#list-of-localized-formats
 */
const readableDate = computed(() => {
  return dayjs
    .unix(normalizedTimestamp.value!)
    .format('ddd, MMM D, YYYY hh:mm:ss');
});
</script>

<style scoped></style>
