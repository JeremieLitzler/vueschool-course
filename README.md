# Projects and notes with VueSchool courses

## Prerequisites

- Visual Studio Code
- [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
- [TypeScript Vue Plugin](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)
- [Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur)
- Install Vue CLI : `npm install -g @vue/cli`
  - You need version 4 or higher ( as of Oct 18th 2023, it is 5.0.8)

## With Vue CLI

See [this README](README-Vuecli.md).

### With Vite

See [this README](README-Vite.md).

## Must read documentation

- [Style guide](https://vuejs.org/style-guide)

## Notes

### Fundamentals

#### Dynamic CSS classes

```javascript
        <li
          v-for="item in items"
          :key="item.label"
          class="item"
          :class="{strikeout: item.purchased}"
        >
          {{ item.label }}
        </li>

```

or for several classes:

```javascript
        <li
          v-for="item in items"
          :key="item.label"
          class="item"
          :class="[item.purchased ? 'strikeout': '', item.highlight ? 'highlight': '']"
        >
          {{ item.label }}
        </li>

```

#### About `computed`

- A `computed` must return a value, contrary to methods.
- When do you need to use `computed` instead of methods?
  - When you change data, use methods.
  - When you change the presentation on the UI, use computed properties.

### [Form validation, with Vuelidate](vuejs-form-validation.md)

#### `$error`

It is a shorthand for`$invalid` = True && `$dirty` = True.

### Routing

#### How to lazy load routes with Vue Router

It is is done with Webpack.

It can be done for the routes or within components having sub-components.

For a route, it looks like this:

```javascript
  {
    path: '/a-route',
    name: 'a-route',
    component: () =>
      import(/* webpackChunkName: "a-route" */ '../views/PageSomething.vue'),
  },

```

Webpack will generate a `a-route.js` file that is loaded only when the route is browsed to.

For a component, we use the same techique the parent component:

```javascript

```
