# Single File Components

See the official documentation on the topic [here for Vue 3](https://vuejs.org/guide/scaling-up/sfc.html) or [there for Vue 2](https://v2.vuejs.org/v2/guide/single-file-components).

Simply said, we will use a `TheComponent.vue` file where the template, component script and its CSS will live.

## What are Single File Components

They can be:

- Views, also called pages, placed under the `src/views` directory in a typical Vue project structure.
- Components, placed under the `src/components` directory in a typical Vue project structure.

**Reminder:** In most projects, component names should always be PascalCase in Single-File Components and string templates - but kebab-case in in-DOM templates ([what is in-DOM templates](https://stackoverflow.com/a/68583980)).

## About scoped styles

Never style HTML elements directly, as it is a bad practice because it cause really bad performance in the browser.

See [this article on the topic of CSS selector performance](https://blogs.windows.com/msedgedev/2023/01/17/the-truth-about-css-selector-performance/).

## Organize the components

It is not recommended to organize components into folders and subfolders under `src/components`.

Instead, use a flat organization approach and follow naming best practice in the Vue style guide:

- [Single-instance component names](https://vuejs.org/style-guide/rules-strongly-recommended.html#single-instance-component-names)
- [Tightly coupled component names](https://vuejs.org/style-guide/rules-strongly-recommended.html#tightly-coupled-component-names)
- [Order of words in component names](https://vuejs.org/style-guide/rules-strongly-recommended.html#order-of-words-in-component-names)
- [Full-word component names](https://vuejs.org/style-guide/rules-strongly-recommended.html#full-word-component-names)

## Code splitting for performance and bandwidth efficiency

### For page and routes

With webpack, it is as easy as using it this way in the router:

```javascript
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }

```

I'd like to understand how to do it with Vite.

I have found this [article](https://sambitsahoo.com/blog/vite-code-splitting-that-works.html).

I need to investigate with the official documentation of [Vue router](https://router.vuejs.org/guide/advanced/lazy-loading.html), maybe [this section](https://router.vuejs.org/guide/advanced/lazy-loading.html#With-Vite)?.

### For conditionnally displayed components

Since a child component may not always be displayed in the UI by default, it is a good idea not to load it in the parent chunk.

For example, when a user action is required, it is recommended to lazy load the component.

Using Webpack, you'll need to use the same methods but in the parent component's code:

```javascript
  components: {
    BigYellowUsername: () =>
      import(
        /* webpackChunkName: "BigYellowUsername" */ "@/components/BigYellowUsername.vue"
      ),
  },
```

Note: chunks may tagged `prefectch` by default.
