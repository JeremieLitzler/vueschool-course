# VueUse for Everyone

## What is VueUse

It brings many composable to Vue applications, in particular composable to use browser API that are not so easy to implement.

For more cool stuff, [read the docs](https://vueuse.org/) and read on below.

## What are the useful composables I saw in the courses

### `useClipboard`

It allows to get the contents of the user’s clipboard in a Vue.js application.

See [the docs](https://vueuse.org/core/useClipboard/) the available bits of the composable: `copy`, `copied`, `text` and `isSupported`.

Here are two examples of usage:

```javascript
const textToCopy = ref("//Hello from Ref Var");
const textToCopy2 = ref("//Hello By Arg");

const { copy: copyRefVar, copied: copiedRefVar } = useClipboard({
  source: textToCopy.value,
  copiedDuring: 500,
});
const { copy: copyArg, copied: copiedArg } = useClipboard({
  source: textToCopy2.value,
  copiedDuring: 500,
});
```

In the template, the usage is:

```htm
<button @click="copyRefVar()">{{ copiedRefVar ? "Copied" : "Copy" }}</button>
<button @click="copyArg(textToCopy2)">
  {{ copiedArg ? "Copied" : "Copy" }}
</button>
```

### `useDark`

It reads the default system preferences and let the user change it.

It also persist the value in local storage, whether it comes from the system or from the user's choice.

The usage by default set a CSS class `dark` on the `html` element.

```javascript
const isDark = useDark();
```

I prefer the most flexible method:

```javascript
const isDark = useDark({
  selector: "html",
  attribute: "color-scheme",
  valueDark: "dark",
  valueLight: "light",
});
```

Then `useToggle` binded to a button or a link element allows to toggle the value:

```htm
<template>
    <pre>isDark = {{ isDark }}</pre>
    <button @click="toggleDark()">Toggle Dark mode</button>
</template>

<script setup lang="ts">
import { useDark, useToggle } from "@vueuse/core";

const isDark = useDark({
  selector: "html",
  attribute: "color-scheme",
  valueDark: "dark",
  valueLight: "light",
});
const toggleDark = useToggle(isDark);
</script>
```

Then, you have got to work on the style sheet.

From the `useDark` call above, you can start with:

```css
:root {
  --light-main: #fafafa;
  --dark-main: #252525;
}

:root[color-scheme="light"] {
  --main-bg-color: var(--light-main);
  --text-color: var(--dark-main);
  --btn-bg-color: var(--theme-color);
  --btn-text-color: var(--light-main);
  --btn-bd-color: var(--theme-color-30);
  --btn-bd-color: var(--theme-color-30);
  --details-bd-color: #09095e;
  --details-text-color: var(--dark-main);
}

:root[color-scheme="dark"] {
  --main-bg-color: var(--dark-main);
  --text-color: var(--light-main);
  --btn-bg-color: var(--theme-color);
  --btn-text-color: var(--dark-main);
  --btn-bd-color: var(--light-main);
  --details-text-color: var(--dark-main);
}
```
