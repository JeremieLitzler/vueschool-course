# Vue.js 3 Fundamentals with the Composition API

## Composition API doesn't replace the Options API

You can use both once.

It was named _Functions API_ because it defines a lot of methods to _compose_ with Vue and build your application.

It is available on Vue 2.7 without plugin, otherwise you need a plugin.

## What does the Composition API solves from Options API

### Problem 1: segmented logical concerns

We must break up the logical concerns to fit things in the differents options.

With Composition API, you can group the logical concerns.

See below for an example:

![code-organisation-options-api-vs-composition-api](images/code-organisation-options-api-vs-composition-code-organisation-options-api-vs-composition-api.png)

### Problem 2: Flawed reusable component logic with mixins

On the Options API, mixins:

- obscures source of component data, meaning you might have no idea a data property comes from a mixin,

  - except if you tell yourself that if it is not in the component, then it is probably in a mixin.
  - if the property is in a global mixin, it could be real hard to find.

- less efficient intellisense in the IDE
- lead to naming collisions
  - even if you can softly enforce rules, nothing will check Automatic

With Composition API and using composables,

- it is easier to share and reuse logic across components of the application
- it makes it very clear where the data property come from. See at [6:35 in lesson "Introduction to the Vue.js 3 Composition API"](https://vueschool.io/lessons/introduction-to-the-vue-js-3-composition-api)

### Problem 3: No or limit support of Typescript

In Vue 2 and the Options API, using Typescript was limited.

With the Composition API, it is available out of the box.

## Using declared variables in the script tag

Object or array, use `.value` to access the underlying value as Vue 3 uses proxies in order to create reactive data.

## Differences between `ref` and `reactive` functions

On `reactive`, you don't need to use the `.value` property to access the value of the reactive variable.

### When to use `ref` or `reactive`

Either:

- use `ref` all the time.
- use `reactive` on array and objects.

**DO NOT USE `reactive` on primitives!**. For that, either:

- use `ref`
- wrap the primitive into an object and use `reactive`.

### `reactive` is not easily replaced

That means you cannot overwrite the reactive variable with a non reactive variable.

### Automatic unwrapping in template

Vue does the autowrapping in the template, so `.value` is use only in the script tag.

## Questions

### What is the best practices about organizing the code in the script tag?

See [this lesson](https://vueschool.io/lessons/vue-fundamentals-capi-computed-properties-in-vue-with-the-composition-api) where I asked the question.

### When to use the Composition API versus Options API

I find that the Options API more structured and the Composition API more flexible.

See [this lesson](https://vueschool.io/lessons/vue-fundamentals-capi-course-conclusion) where I asked the question.
