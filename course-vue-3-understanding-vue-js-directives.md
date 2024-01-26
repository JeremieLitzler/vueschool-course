# Understanding Vue.js Directives

[The docs say](https://vuejs.org/guide/reusability/custom-directives.html):

> Custom directives, on the other hand, are mainly intended for reusing logic that involves low-level DOM access on plain elements.

Well-known native Vue directive are `v-for`, `v-if`, `v-else`, `v-bind` `v-on` or `v-model`.

```html
v-on:click.prevent.stop="openSomething"
```

- `v-on`: the name of the directive.
- `:click`: the argument.
- `.prevent.stop`: the modifier(s) seperated by `.`.
- `openSomething`: the value or data or JavaScript method or function to call.

## Create a Custom Vue.js 3 Directive

It is very simple:

```javascript
<script setup>
  const vColor = (element) => element.style.color = "gold"
</script>

<template>
  <h1 v-color>My title</h1>
</template>
```

That's it!

## Using the Custom Directive's Value

It is the second argument in the custom directive argument.

```htm
<script setup>
  const vColor = (element, binding) => {
    let i = 0;
    const colors =  binding.value;
    setInterval(() => {
        element.style.color = colors[i];
        i++;
        if (i === colors.length) i = 0;
    }, 500);
    }
</script>

<template>
  <!--
    the value must be in single quote
    otherwise it is considered a JavaScript expression (variable, function, etc...)
  -->
  <h1 v-color="'blue'">My title</h1>
</template>
```

That's it a simple example value. But what about an array?

Declare the array of value in the template (non-reactive) or in the script setup using `ref` (reactive).

```htm
<script setup>
  import { ref } from 'vue';

  const colorsPickerArr = ref(['green', 'red', 'gold']);
  const vColor = (element, binding) => {
    let i = 0;
    const colors =  binding.value;
    setInterval(() => {
      element.style.color = colors[i];
      i++;
      if (i === colors.length) i = 0;
    }, 500);
  }

  setTimeout(() => {
    // orange is added after 5 sec.
    colorsPickerArr.value.push("orange")
  }, 5000);
</script>

<template>
  <h1 v-color="colorsPickerArr">My title</h1>
</template>

```

## Using the Custom Directive's argument

The argument is available sur le `binding` parameter under `arg`.

You need to take care of the case where the argument isn't correct using a default

The argument possible values are defined in the custom attribute as an object where the keys are the possible values.

```htm

<script setup>
  import { ref } from 'vue';

  const colorsPickerArr = ref(['green', 'red', 'gold']);
  const vColor = (element, binding) => {
    let i = 0;
    //argument values
    const speedsMs = {
      slow: 2000,
      normal: 1000,
      fast: 500,
    };

    const speedName = binding.arg || 'normal';
    const speed = speedsMs[speedName];
    const colors =  binding.value;
    setInterval(() => {
      element.style.color = colors[i];
      i++;
      if (i === colors.length) i = 0;
    }, speed);
  }

  setTimeout(() => {
    colorsPickerArr.value.push("orange")
  }, 5000);
</script>
<template>
  <h1 v-color:notexist="colorsPickerArr">My title</h1>
</template>
```

## Using the Custom Directive's modifier

Modifiers must be independant: in the example of the argument, it'd not make sense to accept different speed...

They are accessed from the `binding.modifiers`. It is an object where the keys are the modifiers with a value of true if set.

```htm
<script setup>
  import { ref } from 'vue';

  const colorsPickerArr = ref(['green', 'red', 'gold']);
  const vColor = (element, binding) => {
    let i = 0;
    const speedsMs = {
      slow: 2000,
      normal: 1000,
      fast: 500,
    };

    const speedName = binding.arg || 'normal';
    const speed = speedsMs[speedName];
    const colors =  binding.value;

    if(binding.modifiers.underline) {
      element.style.textDecoration = "underline";
    }
    if(binding.modifiers.italic) {
      element.style.fontStyle = "italic";
    }
    setInterval(() => {
      element.style.color = colors[i];
      i++;
      if (i === colors.length) i = 0;
    }, speed);
  }

  setTimeout(() => {
    colorsPickerArr.value.push("orange")
  }, 5000);
</script>

<template>
  <h1 v-color:slow.underline.italic="colorsPickerArr">My title</h1>
</template>
```

## The Directive’s Mounted Hook

Custom directives are supposed to act like components. read [the docs for more](https://vuejs.org/guide/reusability/custom-directives.html#directive-hooks).

By default, the code above willl run twice: `mounted` and `updated`.

So, you declare the custom directive in an object and put the logic in the `mounted` hook:

```javascript
  const vColor = {
    mounted(element, binding) {
        //logic goes here...
    }
  };
```

## The Directive’s unMounted Hook

When using `setInterval`, you will want to stop the internal.

Using the `unmounted` hook, you do so:

```javascript
  const vColor = {
    mounted(element, binding) {
      //logic goes here...
      //The double underscores are there to avoid name collisions.
      element.__ColorInterval__ = setInterval(() => {
        console.log("🖌️ Coloring");
        element.style.color = colors[i];
        i++;
        if (i === colors.length) i = 0;
      }, speed);

    },
    unmounted(element) {
      clearInterval(element.__ColorInterval__);
    }
  };
```

The naming of the interval is a convention: [Name of directive]Interval.

## Register Directives Globally

That is very easy:

- create a folder `directives` where you add a file `directive-name.js` contains the logic.
- import the file in `main.js` and use `.directive()`:

```javascript
import { createApp } from 'vue';
import App from './App.vue';
import clickCloseDirective from './directives/click-close';

createApp(App).directive('close', clickCloseDirective).mount('#app');
```

## Conclusion

As the docs say, don't use custom directive for everything:

> Custom directives should only be used when the desired functionality can only be achieved via direct DOM manipulation. Prefer declarative templating using built-in directives such as `v-bind` when possible because they are more efficient and server-rendering friendly.
