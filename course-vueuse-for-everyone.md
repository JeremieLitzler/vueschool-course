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
