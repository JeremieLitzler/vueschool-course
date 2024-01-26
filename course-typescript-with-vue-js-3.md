# TypeScript with Vue.js 3

## When not to use TypeScript

If you are starting using Vue, [learning Vue in plain old JavaScript first](course-fundamentals.md) is recommanded, then come back.

Also, don't use it:

- for small or prototype applications.
- for teams that don't want to use it.

## Setup of VSC

You will need to install:

- [TypeScript and JavaScript Language Features](https://marketplace.visualstudio.com/items?itemName=Vue.volar).

And you need to disable `TypeScript and JavaScript Language Features` for **the workspace only** by searching the extension for `@builtin typescript`. Reload the VSC window to finish.

## TypeScript in Vue Components

It is as simple as telling the script tag the code is TypeScript with the `lang` attribut equal to `ts`:

```typescript
<script setup lang="ts">
// your code
</script>
```

## Declaring and Typing Component Events

As I explained in [Event definition](course-vuejs-3-fundamentals-with-the-composition-api.md#event-definition), using `defineEmits` allows to get autocomplete in the IDE.

On the parent component, as you type `@`, you will see the event name as you defined it in the child component.

From there, to type the event requires a little extra syntax:

```typescript
defineEmits<{
  (
    //name of event
    //adding the "@" helps to identify native event (one "@") and custom events (two "@").
    event: "@addEntry",
    //payload definition
    entry: { entryMessage: string; emoji: Emoji | null },
  ): void;//return type is always void
}>();
```

**IMPORTANT**: In the naming of the event, do not use camelCase as above if you want autocomplete on the parent component. I've asked the VueSchool community why in [a comment of the lesson](https://vueschool.io/lessons/typing-component-events#comment-6375887030).

## Declaring and Typing Component Props

OK, I tried this one alone, but it wasn't easy.

But, it is actually as easy as the `defineEmits` using the Type-based decoration is recommended in TypeScript project instead of the runtime decoration.

```typescript
const props = defineProps<{
  entry: JournalEntry;
}>();
```

You could also do it this way:

```typescript
interface Props {
  entry: JournalEntry;
}
const props = defineProps<Props>();
```

But you cannot use an import of the interface from a file and therefore, it must be defined in the script setup.

**IMPORTANT**: you cannot use the different style decoration in a same component.

## Typing Template Refs

Template ref is away to access, when necessary, a DOM Element to work on in the script setup.

For example: let's you have a textarea input where you want to focus on as a page loads.

You can achieve this using the following technique:

```typescript
<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
//type must be null as default as the onMounted hook is called when the DOM is loaded.
const textareaElement = ref<HTMLTextAreaElement | null>(null);

//hooks
onMounted(() => textareaElement.value?.focus());
</script>
<template>
  <form class="entry-form" @submit.prevent="handleSubmit">
    <textarea
      v-model="body"
      :maxlength="MAX_CHARS"
      ref="textareaElement"
      placeholder="New Journal Entry for danielkelly_io"
    ></textarea>
    <div class="entry-form-footer">
      <button>Save</button>
    </div>
  </form>
</template>
```

Read [more in the docs](https://vuejs.org/guide/typescript/composition-api.html#typing-template-refs) about typing the template refs.

Read [more in the docs](https://vuejs.org/guide/essentials/template-refs.html) about the Template refs, what they are and are used for.

## Using Provide/inject with typing

Similar to the JavaScript version, the difference is found in the use of the type `InjectionKey` from `vue`:

Injection keys be store in a seperate file that is imported when needed.

For example of a user object to pass on to childs of `App.vue`:

- we create the file containing the inject keys:

```typescript
import type { InjectionKey } from "vue";
import User from "./types/User";

//create a unique InjectionKey since provide requires that.
// Using a Symbol guaranteed the unicity. See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol
export const userInjectionKey = Symbol() as InjectionKey<User>;
```

- we provide the value in `App.vue`:

```typescript
import { provide } from "vue";
import { userInjectionKey } from "@/injectKeys";

provide(userInjectionKey, user);
```

- we use it in any component of the application:

```typescript
import { inject } from "vue";
import { userInjectionKey } from "@/injectKeys";

const user = inject(userInjectionKey);
```

NB: by default, TypeScript know the injected object could be null. So when you use in the template of the component using the value, think about it.

```htm
<span>{{ user?.username || "Anonymous" }}</span>
```

## Using TypeScript with the Options API in Components

You will need to user `defineComponent` and it must be imported, it is not a macro!

It is used to infer types for the component's options.

Also, as noted previously, we cannot use type interface on a runtime decoration style.

For example, in the props definition, if a prop is an object, you will need to:

- define the prop as `Object`,
- use the `PropType` utility to infer the type.

```typescript
import { defineComponent } from "vue";
import type { PropType } from "vue";

export default defineComponent({
  props: {
    date: { type: Object as PropType<MyType>, required: true },
  },
});
```

For computed, using the function type return can add type-safety.

## Augmenting Global Properties and Custom Options

Using the `ComponentCustomProperties` interface, we can extend vue, if we needed.

It requires to create a file at the root. For example:

```typescript
// File: vue-global-props.d.ts
import axios from "axios";

//This extends the vue api
declare module "vue" {
  interface ComponentCustomProperties {
    $axios: typeof axios;
  }
}
```

Then, you need to tell TypeScript the file exists:

```json
{
  "include": [
    "env.d.ts",
    "src/**/*",
    "src/**/*.vue",
    "src/**/*.ts",
    "vue-global-props.d.ts"
  ],
}
```

Then, in a component, the usage would be:

```typescript
export default defineComponent({
  mounted() {
    this.$axios("https://jsonplaceholder.typicode.com/todos/1");
  },
});
```

This works only in the Options API. In the Composition API, using composables is the way to go.

See [this article](https://dev.to/avxkim/using-axios-globally-in-a-vue-3-with-provideinject-composition-api-1jk5) or [that one](https://stackoverflow.com/questions/56850675/how-to-properly-register-axios-globally-in-vue-typescript-application).
