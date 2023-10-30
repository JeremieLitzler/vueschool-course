# Projects and notes with VueSchool courses

## [Prerequisites](part-prerequisites.md)

## [Initialize a Vue project](part-init-vue-project.md)

## [Must read documentation](part-docs-must-read.md)

## Notes

### [Fundamentals](module-fundamentals.md)

### [Form validation, with Vuelidate](module-vuejs-form-validation.md)

### [VueJS Components Fundamentals](module-vuejs-component-fundamentals.md)

### [VueJS 3 Components Fundamentals](module-vuejs3-component-fundamentals.md)

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
