# Nuxt.js 3 Fundamentals

## Why Nuxt

SPA are only good for application not crawled.

If SEO is important, you cannot use a SPA.

That's where Nuxt comes into place. It provides SSR, e.g. _Server Side Rendering_.

Nuxt provides several rendering modes:

- SPA mode
- Universal Rendering mode
- Hybrid Rendering mode (for a by-route roudering)

The second mode is, to me, the one you want to focus on.

## Create a Nux app

It is as simple running this command:

```bash
npx nuxi@latest init <project-name>
```

## File Based Routing

With Nuxt, you can use the following command to create a new page:

```bash
npx nuxi add page <name-of-page>
```

It will create a directory `pages`, if it doesn't exist, and add a scaffolded Vue page component with the name you provided.

You can create sub-directories if you need:

```bash
npx nuxi add page movies/index
```

The above command create a sub-directory `movies` with a `index` page component.

In the generated application, you can now browse to the route `https://example.com/movies/`.

## `NuxtLink` component

It is a wrapper of `router-link`.

Read more [in the official docs](https://nuxt.com/docs/api/components/nuxt-link#props).

## Dynamic Route Params in Nuxt.js

When you have a route with parameters (for ex. `movies/123`), you simply run the command:

```bash
npx nuxi add page movies/[id]
```

A new page component is created and you can access the `id` parameter:

```typescript
<script lang="ts" setup>
import { useRoute } from 'vue-router';
const route = useRoute();
</script>

<template>
  <h1>Page: movies/{{ route.params.id }}</h1>
</template>
```

Similar to creating a sub-directory for a route with a static name, you can create a sub-directory with a parameter in mind:

```bash
npx nuxi add page teams/[teamSlug]/users/[userId]
```

Remark: make sure the parameter that will be used to create a directory or page component are [camelCased, not snake-cased](https://betterprogramming.pub/string-case-styles-camel-pascal-snake-and-kebab-case-981407998841).

If you need to create a link to a parameterized route, you can use `NuxtLink` this way:

```html
<!-- 
    Since the folder structure is 'pages/movies/[id].vue,
    The named route is 'movies-id'
 -->
<NuxtLink :to="{ name: 'movies-id', params: { id: movie.imdbID } }"
  ><img :src="movie.Poster" :alt="movie.Title"
/></NuxtLink>
```

It works like a `router-link` but Nuxt calculates the route name from the file structure.

## Fetching data with Nuxt

You can use `$fetch` that Nuxt provides out-of-the-box.

It automatically parse the response for you.

## Using Components

Just like a Vue 3 app, you can place your components in a folder `components` and simple add your components.

You won't need to import them in the pages: Nuxt takes care of it.

Though Nuxt allows to organize your components into folders, I prefer the flat file structure and I follow the naming rules mentionned in the official styleguide.

## Fetch data with `useAsyncData`, `useLazyAsyncData` or `useFetch`

First, why use `useAsyncData` if we have `$fetch`?

Using `$fetch` does a request on the server and client side.

Since Nuxt renders in Universal mode and therefore fetches the data from the server, using `useAsyncData` will allow to get the data needed and prevent a second and useless fetch request on the client side.

```typescript
const { data } = await useAsyncData(() =>
  $fetch(`${import.meta.env.VITE_OMDBAPI_URL}&i=${route.params.id}`)
);
const movie = ref<Movie | null>(data as unknown as Movie);
```

There was a caveit though in an older Nuxt version, in RC version... As shown above, Nuxt caches the response for a given call to `useAsyncData` where the cache key is the [file name + line number where is `useAsyncData`].

Before, you had to specify a unique key, otherwise, the cache respons would be returned.

As of March 21 of 2024, this is not the case anymore.

## Configure `useAsyncData` with Options

[The Nuxt Team recommendeds](https://nuxt.com/docs/getting-started/data-fetching#minimize-payload-size) that you always pick only the data necessary for the page to optimize performance.

For that, you have two options: `pick` and `transform`.

```typescript
import type Movie from "@@/types/Movie";

const { data } = await useAsyncData(
  (): Promise<Movie> => {
    return $fetch(`${import.meta.env.VITE_OMDBAPI_URL}&i=${route.params.id}`);
  },
  {
    pick: ["Title", "Plot", "Poster", "imdbID"],
    /**
     * Below is the same as above but quicker to write.
     * Also, you get intellisense if you typed the Promise
     * returned on the handler.
     */
    // transform(data) {
    //   return {
    //     Title: data.Title,
    //     Plot: data.Plot,
    //     Poster: data.Poster,
    //     imdbID: data.imdbID,
    //   };
    // },
  }
);
```

Pick (😁) whichever method you prefer. I'll go for `pick`.

All the options are listed on [this documentation page](https://nuxt.com/docs/api/composables/use-async-data).

Also, using `useLazyAsyncData` makes it easier to understand the interface... See [this official example](https://nuxt.com/docs/api/composables/use-lazy-async-data).

Finally, `useFetch` is a shorthand to `useLazyAsyncData` or `useAsyncData` used with `$fetch`. So the code becomes (with lazy mode):

```typescript
import type Movie from "@@/types/Movie";

const { pending, data: movie } = useFetch<Movie>(
  `${import.meta.env.VITE_OMDBAPI_URL}&i=${route.params.id}`,
  {
    key: `/movies/${route.params.id}`,
    default: () => null,
    pick: ["Title", "Plot", "Poster", "imdbID"],
    /**
     * Below is the same as above but quicker to write.
     * Also, you get intellisense if you typed the Promise
     * returned on the handler.
     */
    // transform(data) {
    //   return {
    //     Title: data.Title,
    //     Plot: data.Plot,
    //     Poster: data.Poster,
    //     imdbID: data.imdbID,
    //   };
    // },
    getCachedData(key) {
      const data = nuxtApp.static.data[key] || nuxtApp.payload.data[key];
      console.log("getCachedData>data", data);

      if (!data || data === undefined) {
        return;
      }
      return data;
    },
  }
);
```

## Handling `useFetch` errors

No easy to get it... In the lesson of Vueschool, I couldn't replicate the issue.

## Good SEO With `useHead`

This is the most exciting part in my opinion !

With `useHead` composable, you can define all the meta, links that you need for good SEO and great preview.

The docs are richly detailed on the matter: [read more now](https://nuxt.com/docs/api/composables/use-head) or use TypeScript to get the full intellisense benefits.

## Layouts

Layouts extract common UI patterns into reusable layouts.

You must have the `default.vue` file under the folder `layouts`.

To use a layout, you will wrap `nux-page` with `nuxt-layout` in `app.vue`.

If you happen to need to use another layout, like on a login page, you need to use `definePageMeta` with the option `layout`.

**NB1**: if you use `lang="ts"` on the script setup for the page where you want to use `definePageMeta`, you might mot get the `layout` option from the intellisense. If you do, a `CTRL+SHIFT+P` and run _Developer: Reload Window_ if you use Visual Studio Code.

**NB2**: if you use `lang="ts"` on the script setup, you have to import everything: `ref`, `definePageMeta`, etc.

## Route middleware

There are three kinds of route middleware:

### Anonymous (or inline) route middleware

You define them directly within the page that needs it.

```htm
<script setup lang="ts">
  definePageMeta({
    middleware(to, from) {
      //do whatever...
    },
  });
</script>
```

### Named route middleware

You place them in the `middleware/` directory and automatically loaded via asynchronous import when used on a page.

You can create it using the command `npx nuxi add middleware <name>`.

For example:

```tsx
export default defineNuxtRouteMiddleware((to, from) => {
  console.log(to, from);
});
```

Then, you use it on the page that needs it like so:

```tsx
definePageMeta({ middleware: ["<name>"] });
```

### Global route middleware

You place them in the `middleware/` directory with a `.global` suffix.

Each global middleware is run on every route change. Also, you don't need to use the `definePageMeta`.

### Usecases of middleware

Often, you use middleware to control what pages users can visit.

Let's say we have an `auth` middleware.

```tsx
export default defineNuxtRouteMiddleware((to, from) => {
  const userIsLoggedIn = false;
  if (!userIsLoggedIn) {
    return navigateTo({ name: "login" });
  }
});
```

If the user is logged in, then the user can see the page requested, otherwise, you can use `navigateTo()` that takes a vue-router-styled object as shown above and return it.

You could also use `abortNavigation` but it is not as graceful and UX-friendly.

## Nuxt Server API Routes

With server API routes, you can define api route.

By default, a serve API route accepts all methods.

If you need to limit the method that you can use on a given route, append the method to the file name.

You'll need to get read about Nitro and H3 Server engine to get the most out this feature.

You check out the different docs here:

- [Nuxt Docs - Server Directory](https://v3.nuxtjs.org/guide/directory-structure/server)
- [Nitro](https://nitro.unjs.io/)
- [h3 github repo](https://github.com/unjs/h3)
- [h3 docs](https://www.jsdocs.io/package/h3#package-index-functions)

**NB1:** for testing the endpoints, you can use the [_REST Client_ extension](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) for VSCode. Make sure to clear all the cache as shown in [this Stackoverflow answer](https://stackoverflow.com/questions/67698176/error-loading-webview-error-could-not-register-service-workers-typeerror-fai/69704193#69704193).

## Global State Management with `useState`

The usage is simple:

```tsx
const isLoggedIn = useState<boolean>(
  //name of value
  "isLoggedIn",
  //default value
  () => false
);
```

If you want to make use of your custom reactive state within several pages or components, simply put your custom reactive state in a `useMyCustomState.ts` under a directory `composables`.

For example, to store `isLoggedInd` reactive state, you could write:

```tsx
export const userIsLoggedIn = () =>
  useState<boolean>("isLoggedIn", () => false);
```

Then, thanks to dynamic auto imports, you can use it as simply as this:

```tsx
const isLoggedIn = userIsLoggedIn();
```

This way, no magic string to remember as the name of the reactive state value is found in a single place.

## Global State Management with Pinia

Now, for a more complete solution, using Pinia is possible through this command:

```sh
npm i @pinia/nuxt
```

Pinia becomes useful in large project. But, do use `useState` when you have a small scale application to avoid an additional dependency to be loaded.

## Hybrid Rendering with Nuxt

You can mix in a various set of options: from Static page on-demand, State page, SPA mode, etc.

Using `routeRules`, you can define which single route or group of routes (if you create a subdirectory under `pages`).

The documentation provides a amount of examples: [have a read](https://nuxt.com/docs/guide/concepts/rendering#hybrid-rendering)!

## Nuxt Image

This is an amazing component.

### Install and configure

You can not only very easily resize image from your project but also from any domain!

In `nuxt.config.ts`, simply add the domain to handle:

```tsx
export default defineNuxtConfig({
  modules: ["@nuxt/image"],
  image: {
    domains: ["m.media-amazon.com"],
  },
});
```

### Usage examples

The usage is the following:

```htm
<nuxt-img
  :src="movie.Poster"
  :alt="movie.Title"
  width="200"
  height="150"
  format="avif"
  loading="lazy"
/>
```

Also, when an image is shown on a condition (using `v-if`), you can tell `nxt-img` to `preload` the image:

```htm
<nuxt-img
  v--if="showImage"
  :src="movie.Poster"
  :alt="movie.Title"
  width="200"
  height="150"
  preload
/>
```

### Responsive images

You use the `sizes` _prop_ that handles for you the generation of the all the sizes you requested. For example, the example below generate:

- an image with a width of 320 px used for `xs` screens
- an image with a width of 640 px used for `sm` screens because `sm = 640 px`
- an image with a width of 1536 px usead for `md` screens and above with the limit of 1536 px that is set by the `xxl` screen size (default value).
-

```htm
<nuxt-img
  src="/unsplash.jpg"
  width="1920"
  sizes="xs:100vw sm:50vw md:100vw"
  format="avif"
/>
```

It renders the following HTML:

```htm
<img
  src="/_ipx/w_1536/unsplash.jpg"
  onerror="this.setAttribute('data-error', 1)"
  width="1920"
  data-nuxt-img=""
  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 100vw"
  srcset="
    /_ipx/w_320/unsplash.jpg   320w,
    /_ipx/w_640/unsplash.jpg   640w,
    /_ipx/w_768/unsplash.jpg   768w,
    /_ipx/w_1536/unsplash.jpg 1536w
  "
  data-v-76e0e8ca=""
/>
```

Under the hood, NuxtImage provide to the native img `sizes` and `src-set` according to your configurations.

Read more about the screen size defaults [in the NuxtImage documentation](https://image.nuxt.com/get-started/configuration#screens) which you can adjust to your need in `nuxt.config.ts`.

If you deploy to Netlify, you will want to set the provider:

```tsx
interface NuxtImageConfig {
  domains: string[];
  provider?: string;
}
const nuxtImageConfig: NuxtImageConfig = {
  domains: ["m.media-amazon.com"],
};
/**
 * The environment variable is not set locally, otherwise image won't be rendered.
 */
if (import.meta.env.VITE_NUXT_IMAGE_PROVIDER !== undefined) {
  nuxtImageConfig["provider"] = import.meta.env.VITE_NUXT_IMAGE_PROVIDER;
}
export default defineNuxtConfig({
  modules: ["@nuxt/image"],
  image: nuxtImageConfig,
});
```

To know more the responsive images, [go read the MDN article](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images) on the topic.

### Image Modifiers

By default, the built-in IPX image processor.

It provides [tons of modifiers](https://github.com/unjs/ipx?tab=readme-ov-file#modifiers) to play with!

I have [a working demo here](https://github.com/JeremieLitzler/vueschool-course/blob/project-nuxt-js-3-fundamentals/pages/responsive.vue) but it requires that you use a development server on your machine or self-host the service.

## What about `nuxt-picture`

While the `nuxt-img` is great, what `nuxt-picture` adds is support for the multiple format native functionnality.

Though in March 2024, [_Can I Use_](https://caniuse.com/) tells us [`avif`](https://caniuse.com/avif) or [`webp`](https://caniuse.com/webp) is pretty much full, unless you use some exotic browsers.

However, art direction (e.g. using a completely different image based viewport size) isn't supported yet. You'll have to code the responsive image yourself.
