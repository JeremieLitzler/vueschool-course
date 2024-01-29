# Functional Components

## Why use them

It is about performance.

The idea is that you don't rerun the whole lifecycle at every component that is loaded.

This means that the view instance is not available in a functionnal component, as [described in the migration docs from Vue 2 to Vue 3](https://vuejs.org/guide/extras/render-function#functional-components).

> In more plain English, this means that the component does not support reactivity and cannot make a reference to itself through the this keyword.

I like [this free article](https://medium.com/js-dojo/vue-js-functional-components-what-why-and-when-439cfaa08713) from Vue.js Developers publication on Medium.

It is a pretty complete article.

Read the [Vue 3 docs for more](https://v3-migration.vuejs.org/breaking-changes/functional-components.html).

See my [follow-along project](https://github.com/JeremieLitzler/vueschool-course/tree/project-functional-components) for this course.
