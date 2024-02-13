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

### `usePointer`

This one can be useful to draw on canvas element.

### `useScroll`

This is something I've built for WordPress websites using vanilla javascript.

### `useInfiniteScroll`

I can see using this with a list of transactions with a big amount of data.

The key is to load just the right amount to avoid overflowing the user with data.

### Media and VueUse

VueUse comes with interesting composables that helps a lot with media including video and audio:

- `useDisplayMedia`: used to share a screen.
- `useUserMedia`: used to use microphone or use webcam.
- `useMediaControls`: provides the controls to manage an audio or video playback.

## `useInterfalFn` vs `useRafFn`

According to [this Stackoverflow thread](https://stackoverflow.com/questions/38709923/why-is-requestanimationframe-better-than-setinterval-or-settimeout), to animate on the web, it is better to use _Request Frame Animation_ instead `setInterval`.

The syntax is a little different to control the speed.

See [this commit](https://github.com/JeremieLitzler/vueschool-course/commit/371e8e83ec64d9a5062cbc477867407863a4f996).

### `useTimeout`

This composable is useful for toast notifications.

Just like `useInterfalFn` providing a custom code to execute, it is the same `useTimeoutFn`.

### Animating time

Instead `useInterfal`, which can be hanged if the main thread is block and therefor not count time accurately, using `useTimeStamp` will provide the accurate number of milliseconds elapsed since January 1st 1970.

You can read [this Medium article](https://abhi9bakshi.medium.com/why-javascript-timer-is-unreliable-and-how-can-you-fix-it-9ff5e6d34ee0) to understand why.

A couple other composable usefull for time are:

- `useNow`
- `useDateFormat` to format the dates in various ways, which uses the well-known formats. Read [the docs for more details](https://vueuse.org/shared/useDateFormat/).

### `useTransaction` for loading bars

This can be useful for loading bars.

It comes with a lot of animation presets, using the `TransitionPresets` structure.

If it is not enough, [read the docs](https://vueuse.org/core/useTransition/) to see how you write your own animations

It comes with `onStarted()` and `onFinished()` callbacks, which is handy for changing the color of a loading bar once fully loaded.

### `useRefHistory` and `useDebouncedRefHistory`

I can see using this in a Notion clone.

### `useFetch`

This is a `fetch` made simple with a refetch compability:

```typescript
import { useFetch } from "@vueuse/core";
const id = ref(1);
const url = computed(
  () => `https://jsonplaceholder.typicode.com/todos/${id.value}`
);
const { isFetching, data, error } = useFetch(url, {
  refetch: true,
});
```

This composable does more so [have a look at the docs](https://vueuse.org/core/useFetch/).

A close cousin is `computedAsync` which is very similar, but provide another way to call api.

### `reactify`

This one is useful when we want to make the result of a function reactive.

### Working with logical operators utils

When we work with reactive ref in the script setup, we need to remember to type value.

Those utils are:

- `logicalOr`
- `logicalAnd`
- `logicalNot`

Each can take as many reactive booleans as you want.

### `useCycleList` to build an image carousel

It is as simple the following:

```htm
<template>
  <h3>Demo carousel</h3>
  <div class="carousel">
    <transition>
      <img :src="state" alt="" :key="state" />
    </transition>
  </div>
  <div class="controls">
    <button class="btn-spaced" @click="prev()">Previous</button>
    <button class="btn-spaced" @click="next()">Next</button>
  </div>
</template>

<script setup lang="ts">
  import { useCycleList } from "@vueuse/core";

  const { state, next, prev } = useCycleList([
    "https://picsum.photos/id/237/300/200",
    "https://picsum.photos/id/23/300/200",
    "https://picsum.photos/id/7/300/200",
  ]);
</script>
<style scoped>
  .carousel {
    position: relative;
    height: 300px;
    margin-bottom: 1em;
  }
  img {
    width: 100%;
    position: absolute;
    height: 300px;
    object-fit: cover;
  }
  .v-enter-active,
  .v-leave-active {
    transition: all 0.2s ease;
  }

  .v-enter-from,
  .v-leave-to {
    opacity: 0;
  }

  .controls {
    display: flex;
    justify-content: center;
  }
</style>
```

The `:key` is necessary to see the animation as you transit from an image to another.

More [in the docs](https://vueuse.org/core/useCycleList/).

### `useWindowsSize`

It tells you reactivily what is the size of the window.

### `useWindowsFocus`

It provides the information that the focus is on the window.

### `useIntersectionObserver`

This provides the ability to watch the position of a DOM element.

Using `template ref` on the element to watch, when the watched element is `intersecting`, it will show.

For example:

```javascript
<script setup lang="ts">
import { ref, computed } from 'vue';
import { useIntersectionObserver } from '@vueuse/core';
const h1 = ref(null);
const h1IsVisible = ref(false);
useIntersectionObserver(h1, ([{ isIntersecting }]) => {
  h1IsVisible.value = isIntersecting;
});
</script>

<template>
  <div style="height: 200px; overflow: scroll; border: 1px solid black">
    <h1 :class="{ 'fade-in': h1IsVisible }" style="margin: 300px 0" ref="h1">
      Hello world
    </h1>
  </div>
  {{ h1IsVisible }}
</template>
<style>
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
.fade-in {
  animation: fadeIn ease 1s;
}
</style>
```

### `useVirtualScroll`

When you have a very long list, using this composable is a must.

It is similar to `useInfiniteScroll` in my opinion.

See [the commit](https://stackblitz.com/edit/vitejs-vite-h1c1z3?file=src%2Fcomponents%2FListItem.vue) of VueSchool instructor.

### `useVModel`

This composable allows to code less:

See [this commit](https://stackblitz.com/edit/vitejs-vite-tg9wnf?file=src%2Fcomponents%2FCounterInput.vue).

### Array utils

To handle arrays reactively, checkout the [Array category](https://vueuse.org/functions.html#category=Array) of VueUse composables.

It provides a composable for each native array method.

### `useFileSystemAccess`

You want to edit a file in your computer's file system?

This is the composable to use. Checkout [a simple implementation](https://github.com/JeremieLitzler/vueschool-course/blob/project-vueuse-for-everyone/src/components/UseLocalFileSystemAccess.vue).

### Extending a VueUse composable

It is as easy as creating your own while exporting all the properties and functions of the native composable.

For example, let's enrich the `useCycleList`:

```typescript
import type { UseCycleListOptions } from "@vueuse/core";
import type { MaybeRefOrGetter } from "@vueuse/shared";
import { ref, computed } from "vue";
import { useCycleList } from "@vueuse/core";

enum Direction {
  forward = "forward",
  backward = "backward",
}
export function useAppCycleList<T>(
  list: MaybeRefOrGetter<T[]>,
  options?: UseCycleListOptions<T>
) {
  const direction = ref<string | null>(null);
  const cycleList = useCycleList(list, options);

  const goingForward = computed(() => direction.value === Direction.forward);
  const goingBackward = computed(() => direction.value === Direction.backward);
  function next() {
    direction.value = Direction.forward;
    cycleList.next();
  }

  function prev() {
    direction.value = Direction.backward;
    cycleList.prev();
  }
  return {
    ...cycleList,
    next,
    prev,
    goingForward,
    goingBackward,
  };
}
```
