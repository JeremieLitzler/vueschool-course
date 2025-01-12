# Masterclass 2024

In this article, I'll provide my feedback after taking part of the VueSchool 2024 Masterclass on Vue.js.

I had taken part in the former version and I learned a lot about Vue 3, Firebase, Pinia and TypeScript. Though the former Masterclass didn't teach about TypeScript, I challenged myself to code along while converting the JavaScript code presented to TypeScript.

The new Masterclass is shorter but deals an intermediate level on most topics on Vue.js with TypeScript in mind. VueSchool has a lot of courses that dives into specific topics that the 2024 Masterclass doesn't cover in details.

My reason to complete the 2024 Masterclass was mainly related to:

- refreshing skills
- understanding the basics about Supabase, an exciting alternative to Firebase

## About my Opiniated Boilerplate

While following the new Masterclass, I have created an opiniated boilerplate that uses Vue for the frontend and Supabase for the backend.

To start, I've run the `npm create vue@latest` that uses the latest Vue and Vite. I've chosen the following options:

```plaintext
> npx
> create-vue


Vue.js - The Progressive JavaScript Framework

√ Project name: ... vue-boilerplate-jli
√ Add TypeScript? ... Yes
√ Add JSX Support? ... No
√ Add Vue Router for Single Page Application development? ... Yes
√ Add Pinia for state management? ... Yes
√ Add Vitest for Unit Testing? ... No
√ Add an End-to-End Testing Solution? » No
√ Add ESLint for code quality? » Yes
√ Add Prettier for code formatting? ... Yes
```

## About the shortcut commands

Using a `.bashrc` file, you can enable cool shortcut commands in your UNIX Shell terminal. It works great in the Git Bash terminal.

You simply need to source the file to enable the commands:

```sh
source .bashrc # from the boilerplate root
```

Any time I say _custom command_ below, think about `.bashrc`.

In the course, Mostafa uses _npm_ scripts, but I ran into an issue when I had to link the remote Supabase project in Visual Studio Code. Plus, using `.bashrc` provide autocompletion when using tab in the terminal.

## About the packages

The minimum packages used by the boilerplate are those:

```json
  "dependencies": {
    "@supabase/supabase-js": "^2.46.1",
    "@vueuse/core": "^11.3.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "pinia": "^2.3.0",
    "radix-vue": "^1.9.9",
    "tailwind-merge": "^2.5.4",
    "tailwindcss-animate": "^1.0.7",
    "vue": "^3.5.13",
    "vue-router": "^4.5.0"
  },
  "devDependencies": {
    "@faker-js/faker": "^9.2.0",
    "@tsconfig/node22": "^22.0.0",
    "@types/node": "^22.10.2",
    "@vitejs/plugin-vue": "^5.2.1",
    "@vue/eslint-config-prettier": "^10.1.0",
    "@vue/eslint-config-typescript": "^14.1.3",
    "@vue/tsconfig": "^0.7.0",
    "autoprefixer": "^10.4.20",
    "eslint": "^9.14.0",
    "eslint-plugin-vue": "^9.30.0",
    "npm-run-all2": "^7.0.2",
    "prettier": "^3.3.3",
    "tailwindcss": "^3.4.15",
    "typescript": "~5.6.3",
    "unplugin-auto-import": "^0.18.6",
    "unplugin-vue-components": "^0.27.5",
    "unplugin-vue-router": "^0.10.8",
    "vite": "^6.0.5",
    "vite-plugin-vue-devtools": "^7.6.8",
    "vue-tsc": "^2.1.10"
  }
```

Though in the minimum packages, `vueuse/core` is not mandatory, but highly recommended.

If you need Tailwind, make sure to add:

- `tailwind-merge` and `tailwindcss-animate` as dependencies
- `tailwindcss` as development dependency

If you need a boilerplate for a `Button`, you'll need to use _shadcn for Vue_ and add `class-variance-authority` and `radix-vue`.
If you need a boilerplate for a `Dropdown` and co, you'll need to use _shadcn for Vue_ and `radix-vue`. Run `ui-add` custom command with `dropdown-menu` to install it.
If you need a boilerplate for a `DataTable`, you'll need to add `"@tanstack/vue-table": "^8.20.5"`. Then, run `ui-add` custom command with `table` to install it.

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

To deploy the app on Netlify, you'll want to import the `.env.production` content with your own values.

In my boilerplate, I use the following variables:

```plaintext
# Needed to run the Vue application.
VITE_SUPABASE_URL=https://[your_project_id].supabase.co
VITE_SUPABASE_KEY=[your_project_api_key] # Available at https://supabase.com/dashboard/project/[your_project_id]

# Needed to seed the database, if you need that.
SUPABASE_PROJECT_ID=[your_project_id]
SUPABASE_PROJECT_PASSWORD=[your_db_password]
SUPABASE_PROJECT_SERVICE_ROLE=[your_service_role] # Available at https://supabase.com/dashboard/project/[your_project_id]/settings/api
TESTING_USER_EMAIL="youremail@gmail.com"
```

## Useful Application Folders

I suggest the following folder structure

- `components`: To store components.
  - If using `shadcn`, you'll put its components into a `ui` subfolder.
  - For the layout, create a `layout` subfolder.
  - For the rest, I'd recommend to use a flat-directory approach and follow the official Vue.js guidelines about naming the components.
- `composables`: To store custom composables. But remember, [`vueuse` probably has](https://vueuse.org/) what you need.
- `enums`: See [below](#creating-enums-folder-to-store-magic-strings) for more details.
- `plugins`: To store the custom plugins. The boilerplate doesn't contain any.
- `services`: To store anything related to external API.
  - In the boilerplate, you'll find the services related to authentication, retrieving profiles and the dummy tables.
- `pages`: To store the pages if you use Unplugin Vue Router.
  - In the boilerplate, you'll find:
    - an `index` (for Home),
    - a `login` and a `register` page,
    - a `settings` page,
    - a profile page (expecting the username as a parameter),
    - pages to view the list of dummy entities and a single entity,
    - a page to view a sub entity.
- `router`: To store the router index configuration, even if you use Unplugin Vue Router. That's at least where you define your guards.
- `stores`: To store the Pinia stores.
  - I included the stores to handle the authentication, the profiles and the errors.
- `types`: To store types and interfaces for requests, responses, props, events, etc.
- `utils`: To store helpers.
  - I have included my own date formatter, cache validation (used in Pinia stores) and some basic form validation rules written during the Masterclass.
- `views`: To store the pages if you use Vue Router.
  - This is empty. Read more about it in the next paragraph.

## About Choosing the Routing Strategy

Since I started to use Vue Router, I learned how to define routes and guards in the `router/index` file.

Nuxt introduced a file-based routing system. But you don't need to use Nuxt to enable this feature. Using

You have two options:

- use the manual routes using Vue Router plugin,
- use the file-based routing using Unplugin Vue Router.

### Routing With Vue Router

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

### Routing With Unplugin Vue Router

_Note_: The following is simply a detailed explained about using Unplugin Vue Router. I have coded the boilerplate code since I chose to use the file-based routing.

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
import { createRouter, createWebHistory } from "vue-router/auto";
import { routes } from "vue-router/auto-routes";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
```

Update `env.d.ts` as describe in the comment inside the code above.

And finish by creating a `pages` folder with at least an `index.vue` file for the homepage.

Oh, and a tip in the `script setup` of a page.

If the page receives a parameter, you can get autocompletion from the route value:

```typescript
const { id } = useRoute("/sub-entities/[id]").params;
```

## About the `enums` folder to store magic strings

Magic strings are string literals used directly in code that have a specific meaning or impact on the program's behavior. They are considered an anti-pattern in software development for several reasons:

- They are hardcoded values embedded directly in the source code
- Their meaning is not immediately clear without additional context
- They are often duplicated across the codebase
- They can be difficult to update consistently if changes are needed

As using TypeScript is recommended in Vue.js, I like to use enums to define once and only once.

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
import type { LinkProp } from "@/types/LinkProp";

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

You can write (see the difference with the second `<template>` tag):

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
import type { LinkProp } from "@/types/LinkProp";
import { link } from "fs";

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

See [the documentation on `<template>`](https://vuejs.org/api/built-in-special-elements#template) for more info on the usecases where it works. In fact, not all directives can be used.

## About Pinia and the error on `getActivePinia`

It can happen that you might use Pinia stores outside a component, and therefore, you might see the error:

```log
Uncaught Error: [🍍]: "getActivePinia()" was called but there was no active Pinia. Are you trying to use a store before calling "app.use(pinia)"?
```

You write a dynamic import as follows:

```ts
// logout is a exported const function.
// the file `@/utils/supabase-auth.ts` contains an import to use a `authStore`.
const { logout } = await import("@/utils/supabase-auth.ts");
```

## Composables

They must be initialized inside a script `setup`.

## About Watcher and Asynchronous Operations

I'm not sure what is the reason for this behavior, if you have some code like the following, the watcher won't execute.

```ts
await store.getSubEntity(id);
watch(
  () => subEntity.value?.name,
  () => {
    console.log("watch sub-entity", subEntity.value);

    usePageStore().pageData.title = `Sub-Entity: ${
      subEntity.value?.name || "Not Sub-Entity found"
    }`;
  }
);
```

To solve that, you simply need to swap the asynchronous call and the watcher.

## Using FormKit

FormKit simplifies the form building.

Let's see how you can add it. The boilerplate already includes it. So to remove it, undo the steps that follow.

### The Package

Install the package:

```sh
npm i @formkit/vue
```

### Configure FormKit

First, we'll create `formkit.theme.ts` file at the project's root.
To doso ,

1. Head to the [theme website for FormKit](https://themes.formkit.com)
2. Copy the command on the homepage for the default theme: `npx formkit theme --theme=regenesis`.
3. Run it in Visual Studio Code.

You should see the new file now.

If you need another theme, feel free to play around the interface of this website.

Then, add a `formkit.config.ts` at the project's root with the following content:

```ts
import { defaultConfig } from "@formkit/vue";
import { rootClasses } from "./formkit.theme";

export default defaultConfig({ config: { rootClasses } });
```

Then, we need to tell TypeScript about those configuration files. In `tsconfig.app.json`, add this:

```json
{
  // the rest of the file
  "include": [
    // the rest of the values
    "formkit.config.ts",
    "formkit.theme.ts"
  ]
  // the rest of the file
}
```

Next, in `main.ts`, we'll import _FormKit_ and tell Vue to use it:

```ts
import { plugin } from "@formkit/vue";
import customConfig from "../formkit.config";

const app = createApp(App);

// adding formKit
app.use(plugin, customConfig);
app.mount("#app");
```

From there, we can start using _FormKit_. For usage examples, check the boilerplate project.

## Using Supabase

If you are using Supabase, you'll want to perform the following:

### Create An Account

Browse to [Supabase's website](https://supabase.com/) and sign up with the method of your choice.

Finish with the initialization of your organization and your first project.

**IMPORTANT**: make sure **NOT** to include a special character in your project's password. See the [ongoing issue](https://github.com/supabase/cli/issues/1760#issuecomment-2475716349) about this and if at the time of reading this post, the issue has been resolved.

### Install the CLI (Not From NPM)

I recommend using the CLI from [Supabase with Scoop](https://scoop.sh/#/apps?q=supabase) rather than the npm package.

That'll avoid the dev dependency in your repository's `package.json`.

### Initiliaze the Project In Visual Studio Code

Run the custom command:

```sh
sp-init
# Generate VS Code settings for Deno? y
# Generate IntelliJ Settings for Deno? N
```

It created a `supabase` folder at the root of the project.

### Login to Supabase

Run:

```sh
sp-login
```

It'll prompt you to hit `Enter` to copy and paste a single-use code to finish the process.

### Link Your Remote Project to The Local One

To do so, you'll need to set the environment variables. Get them from the Supabase Dashboard.

Then, run:

```sh
sp-link-env
```

**Important**: make sure the browser window that open is where you're logged in to your Supabase account for the project you configured in the `.env` file. Otherwise, you might get the error `Authorization failed for the access token and project ref pair: {"message":"Failed to retrieve project"}`.

### Create a New Migration To Store The Profiles Table

The boilerplate contains that migration. But I'd like to detail how you can create a migration.

The profile table enriches the `auth.users` table Supabase provides to you by default. The two tables are linked through `id` column.

Here is the migration code I recommend:

```sql
drop table if exists profiles;
TRUNCATE auth.users cascade;

create table
  profiles (
    id uuid references auth.users on delete cascade not null,
    created_at timestamptz default now() not null,
    updated_at timestamptz null,
    username text unique not null,
    full_name text not null,
    bio text default null,
    mode text default 'dark' not null,
    avatar_url text default null,

    primary key (id)
  );

-- This allows to enable row level security on your tables.
-- See https://supabase.com/docs/guides/database/postgres/row-level-security#enabling-row-level-security
alter table "public"."profiles" enable row level security;

-- The following create row level access policies to protect the data to
--        viewed or altered from outside.
-- You can visit this link on your account.
-- Replace {project_id} and {table_id} with your account's data.
-- https://supabase.com/dashboard/project/{project_id}/auth/policies?search={table_id}&schema=public

-- In these examples, only authenticated users can SELECT or INSERT
-- into the `profiles` table.
-- Since Supabase is Zero-Trust, UPDATE and DELETE are denied, unless
-- you declare a policy to state otherwise
create policy "Enable read access for authenticated users only"
on "public"."profiles"
as PERMISSIVE
for SELECT
to authenticated
using (true);

-- This rule prevents any new registration for non-authenticated users.
create policy "Enable insert access for authenticated users only"
on "public"."profiles"
as PERMISSIVE
for INSERT
to authenticated
with check (true);
```

### Run the Migration

To test the migration, run the following custom command:

```sh
sp-db-reset
```

It will run all migrations (one for now). Answer to the prompt.

Once completed, you can check the _Table Editor_ on the Supabase dashbord and the `profiles` table should appear under the `public` schema.

### Seed the Database With a User

The boilerplate is ready to register any new user. However, Supabase restricts the usage of creating account using the _email and password_ method. Read about the reason why [here](https://github.com/orgs/supabase/discussions/29370) and [there](https://supabase.com/docs/guides/auth/auth-smtp).

Now, you can seed your database. The boilerplate provides a starting point to add a test user.

Make sure to set `TESTING_USER_EMAIL` environment variable. It'll be set as the login and password for the test account.

Then, run:

```sh
sp-db-seed
```

The new profile should appear in the `profiles` table.

### Little Tweak For First Sign-In

Now, you take the boilerplate as I provide it and try to login with the test account, Supabase will reply _Email not confirmed_.

This is because we have an option enabled by default.

I have found that the option on the dashboard doesn't solve the issue.
You can find it under the _Authentication_ blade, browse to _Auth Providers_.
Select the _Email_ provider and the _Confirm email_ is enabled. To sigin, disable the option.

To solve the problem, you need to modify the seeding procedure to set the `email_confirmed_at` to `Date.now()` when calling `supabase.auth.signUp`.

You'll need to rerun the database reset and seed custom commands.

Then, you can repeat the sign-in. It should succeed.

### Make Sure to Define The _Row-level Policies_ in The Migrations

To avoid a lot of manual work on the Supabase dashboard, I recommend to code your row-level policies.

You need to think about it at least when you create any table. Then, depending on your business rules, you may add more specific rules.

In the boilerplate, I've added two dummy tables to demonstrate a few concepts about writting your migration and reading the values from those tables in the Vue application.

## Deployment

### Tell Netlify Vue Handles Requests

When deploying on Netlify a Vue application, you'll need a file to avoid 404 erros. That file goes into the public directory.

Name the file `_redirects` and paste the following content:

```plaintext
/* /index.html 200
```

It tells Netlify to redirect all request to the index file and let Vue handle the page requests.

### Set Environment Variables

Use your `.env` file to import the value needed to run the application on Netlify.

## Conclusion

Mostafa's teaching skills helped me to refresh my skills on Vue.js and learn how to use Supabase.

I still recommend VueSchool courses and I would also try their certification plateform now providing certifications for Vue.js, Angular, Nuxt and _plain old_ JavaScript.
