# Masterclass 2024

## About Environment Variables

In a Vite-powered app, you want to make sure the sensitive credentials aren't exposed...

All environment variables must be prefixed with `VITE_` to be accessible in your application. If you have a variable that is undefined, it is very likely you didn't add the prefix.

Also, with Vite, use `import.meta.env` to access the variable instead of the former `process.env`.

Environment variables are loaded at build time, not runtime.

You can create different environment files for different modes:

- `.env` (default for all modes)
- `.env.local` (local overrides, ignored by git)
- `.env.development` (development mode)
- `.env.production` (production mode)

To deploy the app on Netlify, you'll want to import the `.env.production` content.

## Useful Folders

- `components`: To store components. If using `shadcn`, you'll put its components into a `ui` subfolder. For the layout, create a `layout` subfolder.
- `components`: To store custom composables. But remember, [`vueuse` probably has](https://vueuse.org/) what you need.
- `types`: To store interfaces for requests, responses, props, events, etc
- `pages`: To replace the `views` folder if you use Unplugin Vue Router.
- `plugins`: To store the custom plugins
- `enums`: See [below](#creating-enums-folder-to-store-magic-strings) for more details.

## Choose the routing strategy

You have two options:

- use the manual routes using Vue Router plugin,
- use the file-based routing using Unplugin Vue Router.

## Creating `enums` folder to store magic strings

Magic strings are string literals used directly in code that have a specific meaning or impact on the program's behavior. They are considered an anti-pattern in software development for several reasons:

- They are hardcoded values embedded directly in the source code
- Their meaning is not immediately clear without additional context
- They are often duplicated across the codebase
- They can be difficult to update consistently if changes are needed

As using TypeScript is recommended in Vue.js, I like to use enums to define once and only once.

## Routing With Vue Router

- add a generic catch all

```ts
    {
      //catchAll is a wild card predefined in Vue to match all possible paths
      // (.*) matches any characters
      // * matches the previous patterns as many times as necessary
      path: '/:catchAll(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
    },
```

- add a specific catch all

```ts
    {
      //catchAll is a wild card predefined in Vue to match all possible paths
      // (.*) matches any characters
      // * matches the previous patterns as many times as necessary
      path: '/projects:catchAll(.*)*',
      name: 'project-not-found',
      component: () => import('@/views/NotFoundView.vue'),
    },
```

However you need to make sure the route name is different for each "Not Found" specific route, like above.

## Routing With Unplugin Vue Router

You need to add the following to silence the ESLint rule that reports errors because of the filed-based routing convention:

```js
  rules: {
    'vue/multi-word-component-names': 0
  }
```

In the `router` folder, declare the router using Unplugin Vue Router:

```ts
// the import below requires the following line
// to be added to `env.d.ts` to register the global
// typed in the IDE.
// otherwise, there will be an TS error.
//
// <reference types="unplugin-vue-router/client" />
import { createRouter, createWebHistory } from 'vue-router/auto';
import { routes } from 'vue-router/auto-routes';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
```

Update `env.d.ts` as describe in the comment inside the code above

And finish by creating a `pages` folder with at least an `index.vue` file for the homepage.

## `<template>` for conditional logic

When you have something like a list of elements that are either links or button where the first need a `to` property to pass on to the `RouterLink` whereas the second doesn't, using the `<template>` element allows us to add logic in the component's template without rendering a new DOM elements.

So instead of:

```vue
<template>
  <RouterLink
    exact-active-class="text-black bg-green-300"
    v-for="link in realLinks"
    :key="link.to"
    :to="link.to"
    class="side-bar-link"
  >
    <iconify-icon :icon="link.icon"></iconify-icon>
    <span class="hidden lg:block text-nowrap">{{ link.label }}</span>
  </RouterLink>
  <div
    v-for="link in nonLinks"
    :key="link.label"
    class="side-bar-link cursor-pointer"
  >
    <iconify-icon :icon="link.icon"></iconify-icon>
    <span class="hidden lg:block text-nowrap">{{ link.label }}</span>
  </div>
</template>

<script setup lang="ts">
import type { LinkProp } from '@/types/LinkProp';

const { links } = defineProps<{
  links: LinkProp[];
}>();

const realLinks = links.filter(
  (link): link is LinkProp & { to: string } => !!link.to
);
const nonLinks = links.filter(
  (link): link is LinkProp & { to: string } => !!!link.to
);
</script>
<style lang="css" scoped>
.side-bar-link {
  @apply flex items-center gap-3 px-4 py-2 mx-2 transition-colors rounded-lg hover:text-primary justify-center lg:justify-normal text-muted-foreground;
}
</style>
```

You can write:

```vue
<template>
  <template v-for="link in links" :key="link.to">
    <RouterLink
      v-if="link.to"
      :to="link.to"
      exact-active-class="text-black bg-green-300"
      class="side-bar-link"
    >
      <iconify-icon :icon="link.icon"></iconify-icon>
      <span class="hidden lg:block text-nowrap">{{ link.label }}</span>
    </RouterLink>
    <div v-else class="side-bar-link cursor-pointer">
      <iconify-icon :icon="link.icon"></iconify-icon>
      <span class="hidden lg:block text-nowrap">{{ link.label }}</span>
    </div>
  </template>
</template>

<script setup lang="ts">
import type { LinkProp } from '@/types/LinkProp';
import { link } from 'fs';

const { links } = defineProps<{
  links: LinkProp[];
}>();
</script>
<style lang="css" scoped>
.side-bar-link {
  @apply flex items-center gap-3 px-4 py-2 mx-2 transition-colors rounded-lg hover:text-primary justify-center lg:justify-normal text-muted-foreground;
}
</style>
```

See the documentation for more info on the usecases where it works. In fact, not all directives can be used.
