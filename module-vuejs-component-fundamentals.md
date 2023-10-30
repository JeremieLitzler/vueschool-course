# Vue.js Components Fundamentals

[Back to the table of content](README.md)

## About the template

It **MUST** have a single root element. There is no exception.

## Naming components

As it is detailed in the Style guide (for [Vue 2](https://v2.vuejs.org/v2/style-guide/?redirect=true), for [Vue 3](https://vuejs.org/style-guide/)), single name components are a bad practice.

Avoid it or you might have collision with native HTML elementsm, today or in the future.

## Props declaration

Document your props, as the style guide also suggests.

It will make the component more robust and clear to understand.

## Registration of components

A component can be:

- locally registered
- globally registered

Global components are not ideal, because, even if you don't use it, then the build tool (ex.: Webpack) will include it in the bundles, even if it is not used in the application.

```javascript
Vue.component('plan-picker', {// <== this is a global register
  template: '#plan-picker-template',
  components: {
    'plan-item': PlanComponent, // <== this is a local register
  },
  data() {
    return { plans: ['The Single', 'The Curious', 'The Addict'] };
  },
});
```

Locally-registered plans are not visible unless used within the parent component they live in.

### What should be globally registered then

Base button, base inputs, etc. are fine.

## Communication Between Components with Custom Events

### From a parent to a child

We use **Props**.

**_WARNING:_** HTML attributes are case sensitive, name the props from the parent in Kebab case (ex.: `this-attribute` instead of `thisAttribut`).

### From a child to a parent

We use **Custom events**.

Custom events use the directive `$emit` that takes an event name and a payload.

PS1: The payload isn't required.

PS2: Name the event well and use Kebab-case in the child component **_AND_** the parent's template to avoid headaches!

## Lifecycle Hooks

See [the course](https://vueschool.io/lessons/understanding-the-vuejs-lifecycle-hooks) about that.

## Slots

Slots and Props are similar, but they provide very different approaches and are useful in different usecases.

As a rule of thumb, use slots when you need to pass on HTML of other markup to a component.

For example, a template using slots could be:

```htm
<script type="text/x-template" id="todo-item-template">
      <div>
        <input type="checkbox" v-model="completed">
        <span :class="{done: completed}">
          <!-- Here is rendered the content of todo-item, e.g. "Eat Bananas" -->
          <slot></slot>
        </span>
        <!-- The usage in the next example below "<template #description>" for the named slot below -->
        <slot name="description">No description</slot>
        <button>
          <!-- The word "Highlight" below is the default slot value, in case you don't specify a slot button in the usage of "Eat Bananas" above -->
          <slot name="button-text">Highlight</slot>
        </button>
      </div>
    </script>
```

The usage could be:

```htm
<todo-item>
    <!-- This the content tha goes into  <slot></slot> -->
    <!-- Anything that is not in a named slot will into the unnamed slot -->
    Buy Bananas

    <!--Using the named slot "description" -->
    <template #description>
        <p>Bananas are good for your health.</p>
    </template>
    <!--Using the named slot "button-text" -->
    <template #button-text> Make it rain </template>

    <!-- This will be rendered before the named slot just above. It kinda mess up the HTML... so you should use a named slot for it. -->
    <p>The End.</p>
</todo-item>

<!-- This usage will use the default value for the named templates -->
<todo-item> Eat Bananas </todo-item>
```
