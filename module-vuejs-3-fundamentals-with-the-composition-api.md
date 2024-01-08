# Vue.js 3 Fundamentals with the Composition API

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

See [lesson](https://vueschool.io/lessons/vue-fundamentals-capi-computed-properties-in-vue-with-the-composition-api) where I asked the question.

### When to use the Composition API versus Options API

I find that the Options API more structured and the Composition API more flexible.
