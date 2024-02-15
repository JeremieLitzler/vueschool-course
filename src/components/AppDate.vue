<template>
  <span :title="readableDate">
    {{ elapsedTime }}
  </span>
</template>

<script>
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(localizedFormat).extend(relativeTime);

export default {
  props: {
    timestamp: {
      type: Number,
      required: true,
    },
  },
  computed: {
    /**
     * Calculate the elapsed time from timestamp
     * @returns {string}
     * @see https://day.js.org/docs/en/customization/relative-time#docsNav
     */
    elapsedTime() {
      return dayjs.unix(this.timestamp).fromNow();
    },
    /**
     * Format the timestamp to readable date.
     *
     * @returns {string}
     * @see https://day.js.org/docs/en/display/format#list-of-localized-formats
     */
    readableDate() {
      return dayjs.unix(this.timestamp).format("ddd, MMM D, YYYY hh:mm");
    },
  },
};
</script>

<style lang="scss" scoped></style>
