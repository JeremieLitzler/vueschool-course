<template>
  <details id="useAlertFavicon">
    <summary
      :aria-label="summaryAccessibilityLabel"
      :title="summaryAccessibilityLabel"
    >
      <pre>useAlertFavicon</pre>
    </summary>
    <article>
      <p>
        The <i>Alert</i> button will show an emoji every second in place of the
        favicon
      </p>
      <p>The <i>Change</i> button will replace the favicon with another one</p>
      <p>The <i>Cancel</i> will stop the favicon animation</p>
    </article>
    <article>
      <h3>Demo 1 with defaults</h3>
      <button class="btn-spaced" @click="defaultAlert">Alert</button>
      <button class="btn-spaced" @click="faviconDemo1 = jeremielFavicon">
        Change
      </button>
      <button class="btn-spaced" @click="cancelDemo1">Cancel</button>
    </article>
    <article>
      <h3>Demo 2 using options</h3>
      <button class="btn-spaced" @click="alertDemo2">Alert</button>
      <button class="btn-spaced" @click="faviconDemo2 = jeremielFavicon">
        Change
      </button>
      <button class="btn-spaced" @click="cancelDemo2">Cancel</button>
    </article>
  </details>
</template>

<script setup lang="ts">
import { /*ref,*/ inject } from "vue";

import { summaryAccessibilityLabelKey } from "../injectKeys.ts";

const summaryAccessibilityLabel: string | undefined = inject(
  summaryAccessibilityLabelKey
);

import useAlertFavicon from "../composables/useAlertFavicon";

const vueFavicon =
  "https://raw.githubusercontent.com/vueschool/useAlertFavicon-boilerplate/main/public/favicon.ico";
const jeremielFavicon = "https://jeremielitzler.fr/favicon.ico";
const {
  alert: defaultAlert,
  favicon: faviconDemo1,
  cancel: cancelDemo1,
} = useAlertFavicon(vueFavicon);

const {
  alert: alertDemo2,
  favicon: faviconDemo2,
  cancel: cancelDemo2,
} = useAlertFavicon(vueFavicon, {
  speed: 500,
  emoji: "⚡",
});
</script>
<style scoped></style>
