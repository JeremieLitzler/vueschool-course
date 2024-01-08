# Vue.js 3 Fundamentals with the Options API

## Two ways data binding

You can fill a array from a list of checkbox when they are all bound to the same data property.

Fo example, when check a checkbox as declared below, the value is added to `` that is an array in the Vue instance.

```htm
      <label>
        <input
          type="checkbox"
          v-model="iceCreamFlavors"
          name="flavorVanilla"
          value="vanilla"
        />
        Vanilla
      </label>
      <label>
        <input
          type="checkbox"
          v-model="iceCreamFlavors"
          name="flavorCookieCream"
          value="cookies and cream"
        />
        Cookie and cream
      </label>
      <label>
        <input
          type="checkbox"
          v-model="iceCreamFlavors"
          name="flavorChocolate"
          value="chocolate"
        />
        Chocolate
      </label>
      <label>
        <input
          type="checkbox"
          v-model="iceCreamFlavors"
          name="flavorStrawberry"
          value="strawberry"
        />
        Strawberry
      </label>
```

## User events

We can listen to events using `v-on` directive (shorthand `@`).

## Methods

We cannot use arrow function on methods.

Why? Because of the scope of the methods and the `this` keyword.

In an arrow function would not refer to the view application instance.

## Conditional rendering

Vue doesn't render the HTML if the code tells Vue not display something. It is cleaner than a `display: none`!

## v-bind special cases

What are they?

CSS classes. For those, we use an object syntax:

```htm
        <li
          v-for="{id, label, purchased, highPriority} in items"
          :key="id"
          :class="{strikeout: purchased, priority: highPriority}"
        >
```

We add as many dynamic classes as we want.

For static classes, simply use the `<li class="class1 class2"></li>` in addition to the binded `:class` attribut.

We can also use the array syntax using `v-bind`, but that results in the same output as native way in HTML.

However, it can become useful in the following usecase:

```htm
<li
    :class="[
        item.purchased ? "some-class-when-true less-bold" : "some-class-when-false",
        item.highPriority ? "highlight" : "regular",
    ]"
>
...
</li>
```

Finally, we can combine the arry and object syntax and add static classes, like so:

```htm
<li
    :class="[
        {strikeout: purchased},
        {priority: highPriority},
        "static-class"
    ]"
>
...
</li>
```

## Computed key information

A computed:

- always returns data
- shouldn't change the source data, but only how it is presented. Otherwise, **this is a big source of bugs!**

Methods are there to modify data.
