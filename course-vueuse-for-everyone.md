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

### `onKeyStroke`

This could be very useful to implement custom shortcuts logic in an application.

Indeed, no matter what’s focused in your Vue.js application, the events still behave as expected.

There is two main implementations:

- when you allow the event to be repeated as you hold the key down:

  ```typescript
  onKeyStroke(["a", "A", "ArrowLeft"], () => {
    // your logic
  });
  ```

- when you don't want to ignore repeated events

  ```typescript
  onKeyStroke(
    ["d", "D", "ArrowRight"],
    () => {
      // your logic
    },
    { dedupe: true }
  );
  ```

Read [more in the Vueuse docs](https://vueuse.org/core/onKeyStroke). Also, about the key names, [see the MDN page](https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values).

### `useMagicKeys`

It works similar to `onKeyStroke`, but the usage that could interest you is the combinaison of keys.

Even if you can use it this way for single keys:

```javascript
const { a, b, c, d } = useMagicKeys();
```

You can also use it key combinaison

```javascript
const { a_s, a_w } = useMagicKeys();

const a_s_pressed = ref(false);

whenever(a_s, (pressed) => (a_s_pressed.value = pressed));
//a_s_pressed remains true, even after the keys are released.

const a_w_pressed = ref(false);
watch(a_w, (pressed) => (a_w_pressed.value = pressed));
//a_w_pressed returns to false,  after the keys are released.
```

Finally, the composable makes available the `current` property which provides a `Set` of maximum 6 keys pressed at once.

### Device sensors with `useBattery`, `useOnline`, `useNetwork` and `useGeolocation`

Those could be very useful, espacially the `useOnline` or `useNetwork` to notify the end-user that the network is unavailable.

### `usePageLeave` and `useConfirmDialog`

`usePageLeave` is great to use when someone is leaving the windows and that you want to retain him with an offering.

Usually, you show a modal. But be careful not to fall for the basic example that is not accessible. Using the native `dialog` element, you will make it accessible more easily.

But using Vue 3 and VueUse, how do you do it? See [this commit](https://github.com/JeremieLitzler/vueschool-course/commit/1f372e3056c746e5e58c865bf3740d459537a521#diff-dbbd8914be1f046ee8c0e831315b143634b53e464275239b00773ab9b12c2fb0).
