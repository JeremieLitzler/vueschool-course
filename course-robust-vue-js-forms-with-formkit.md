# Robust Vue.js Forms with FormKit

## What is FormKit

As stated on [their website](https://formkit.com/), FormKit equips developers to build their forms 10x faster by simplifying form structure, generation, validation, theming, submission, error handling, and more.

And also:

> [Vuelidate is] another great option for form validation, but focused solely on validation. FormKit provides additional scaffolding and features such as accessibility, i18n, and input composition, enabling developers to create complex forms with minimal friction with validation and error handling included.

See [the docs](Vuelidate).

So it is more complete to build forms.

## Free vs Pro

Not everything is free in FormKit. In fact, some input which are non native (date picker, autocomplete) require a pro licence since the rest is just open source.

## Simple usage

```htm
<FormKit
  type="text"
  label="Username"
  name="username"
  help="Pick a new username"
  validation="required|matches:/^@[a-zA-Z]+$/|length:5"
  value="@userFormKit"
  prefix-icon="avatarMan"
/>
```

## Using the available slots in `FormKit`

You can customize the labels, the help text as they belonging to named slots.

In fact the generated HTML looks this for the simple usage above:

```htm
<div
  class="formkit-outer"
  data-family="text"
  data-type="text"
  data-prefix-icon="true"
  data-invalid="true"
>
  <div class="formkit-wrapper">
    <label class="formkit-label" for="input_0">Username</label>
    <div class="formkit-inner">
      <label class="formkit-prefix-icon formkit-icon" for="input_0"
        ><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13 16">
          <path
            d="M4,10h5c1.66,0,3,1.34,3,3v2H1v-2c0-1.66,1.34-3,3-3Z"
            fill="currentColor"
          ></path>
          <path
            d="M4,4h5v2.5c0,1.38-1.12,2.5-2.5,2.5h0c-1.38,0-2.5-1.12-2.5-2.5v-2.5h0Z"
            fill="currentColor"
          ></path>
          <path
            d="M9,4h0c.55,0,1,.45,1,1h0c0,.55-.45,1-1,1h0v-2h0Z"
            fill="currentColor"
          ></path>
          <path
            d="M3,4h0c.55,0,1,.45,1,1h0c0,.55-.45,1-1,1h0v-2h0Z"
            transform="translate(7 10) rotate(180)"
            fill="currentColor"
          ></path>
          <path
            d="M4.12,4.12h-.5c-.75-.62-.62-1.57-.62-2.37h0s.5-.26,1-.26,1,.5,1,.5c-.88,0-1-1-1-1h3c1.1,0,2,.9,2,2h.5s.25,.75-.12,1.25l-5.25-.12Z"
            fill="currentColor"
          ></path>
        </svg> </label
      ><!----><input
        class="formkit-input"
        type="text"
        name="username"
        value="@userFormKit"
        id="input_0"
        aria-describedby="input_0-rule_matches"
        aria-required="true"
      /><!----><!---->
    </div>
  </div>
  <!---->
  <ul class="formkit-messages">
    <li
      class="formkit-message"
      id="input_0-rule_matches"
      data-message-type="validation"
    >
      Username is not an allowed value.
    </li>
  </ul>
</div>
```

If you want, you can customize the slots as follows:

```htm
<FormKit
  type="text"
  label="Username"
  name="username"
  help="Pick a username"
  validation="required|matches:/^@[a-zA-Z]+$/|length:5"
  value="@userFormKit"
  prefix-icon="avatarMan"
>
  <template #label="context"
    >{{ context.label }}? <span>{{ context.help }}</span></template
  ><template #help></template
></FormKit>
```

## Form Population and Submission

When you build a form with FormKit, you need to apply the same logic as you do for a regular form, i.e. wrap your inputs in form tag.

With FornKit, we simply use the exact same component, `<FormKit />` but with the type `form`:

```htm
<FormKit type="form" :value="formData">
  <h1>Login</h1>
  <FormKit type="text" label="Username" name="username" />
  <FormKit type="password" label="Password" name="password" />
</FormKit>
```

The `:value` tells FormKit that it need to bind the `formData` object to the inputs. You declare it in the script setup:

```typescript
const formData = ref({
  username: "Jeremiel",
  password: "",
});
```

It is important to note that the property names of the object must match the input's name to be prefilled.

To submit the form, just like native forms, add the `@submit` with a handler function that you declare in the script setup.

```typescript
const submit = (data) => {
  console.log(data);
};
```

It receives one argument that you can name `data` and contains at least the same properties as any `formData` used to prefill some inputs plus any other inputs you may have in the form.

## Customize the Form with Props

By default, you don't need to worry about adding a submit button in the form. FormKit does it for you.

To customize the label of the button, you will need to go throught the built-in props of the `FormKit` component: `submit-label="Login"`

You could take over handle the creation of the button yourself though: with `:actions="false"`, you need to add the button and manage it yourself.

However, using the default slot, we add the custom button element and keep the good stuff about state
management in FormKit:

```htm
<FormKit
  type="form"
  :value="formData"
  @submit="submit"
  submit-label="Login"
  :actions="false"
>
  <template #default="{ state }">
    <h1>Login</h1>
    <FormKit type="text" label="Username" name="username" />
    <FormKit
      type="password"
      label="Password"
      name="password"
      validation="required"
    />
    <FormKit type="checkbox" label="Remember me?" name="rememberMe" />
    <button :disabled="state.loading">
      {{ state.loading ? "Logging-in you..." : "Login" }}
    </button>
  </template>
</FormKit>
```

## How to Validate a Form Input

FormKit provides the `validation` prop that can, not only, take several built-in validation but also custom rules.

Rules are seperated by pipes and they are run in sequence.

```htm
<FormKit
  type="password"
  label="Password"
  name="password"
  validation="required|alpha|length:10-30"
/>
```

You can define the validation as an array:

```htm
<FormKit
  type="password"
  label="Password"
  name="password"
  validation="[['required'], ['alpha']['length', 10, 30]]"
/>
```

See the available rules [in the docs](https://formkit.com/essentials/validation#available-rules).

By default, validations are run on `blur`, e.g. when the user exists the inputs.

Also read [the docs](https://formkit.com/essentials/validation#setting-validation-visibility-for-an-entire-group#showing-errors) for the possible value of the `validation-visibility` prop to control when the validation failing shows up.

FormKit will never run the submit handler function if the form is not valid.

## Rules hints

There are 4 hints that provide further control on how the validations run.

- `Debounce`: debounces the validation rule by the given number of milliseconds.
  - this is usually to build custom validation rules.
- `+`: runs the validation rule even if the input is empty (but not force the rule).
- `*`: runs the validation rule even if a previous rule was failing.
- `?`: makes a validation rule optional (it is non-blocking meaning the form can still submit).

You place them before the name of the rule.

```htm
<FormKit
  type="text"
  label="Website"
  name="website"
  validation="+length:16:20|*url"
/>
```

The above means the `website` input must:

- not be empty (`+`)
- contain between 16 and 20 characters (`length:16-20`)
- be a valid URL (`*url`) (runs even if the length validation fails, which is the case by default).

You can use more than one hint per rule.

Read [the docs for more](https://formkit.com/essentials/validation#rule-hints).

## Custom Validation Rules

It is as easy as defining a function in the script setup.

That function takes a node as a parameter and you can therefore access the value of the input node.

The function can also take min and max parameters.

The return expected is either `true` or `false`.

The function can work asynchronously.

```htm
<script setup>
  function username_is_unique(node) {
        const usernames = ["jpschroeder", "luanguyen", "danielkelly_io"];
        return !usernames.includes(node.value as string);
      },
</script>
<template>
  <FormKit
    validation="(500)username_is_unique"
    :validation-rules="{ username_is_unique }"
    type="text"
    label="Username"
    name="username"
  />
</template>
```

FormKit requires to register the custom rule using the `:validation-rules` prop that accept values of the custom rules in object-like string (see above).

However, if the rule is meant to be reusable, it even better to register the rule in `formkit.config.ts` file though.

```typescript
const config: DefaultConfigOptions = {
  theme: "genesis",
  rules: {
    username_is_unique(node) {
      const usernames = ["jpschroeder", "luanguyen", "danielkelly_io"];
      return !usernames.includes(node.value as string);
    },
  },
};
```

NB: if the rule takes long to run, using the rule hin `Debounce` is a good usecase.

### Customizing the validation messages

The next step to define a validation message that is more explicit than `This filed is not valid`.

In the `FormKit` component, you can do so using the `:validation-messages` prop that takes an object:

```htm
<template>
  <FormKit
    validation="(500)username_is_unique"
    :validation-rules="{ username_is_unique }"
    :validation-messages="{ username_is_unique: 'Username must be unique.' }"
    type="text"
    label="Username"
    name="username"
  />
</template>
```

You can even define a function to compute the message to show on validation exception:

```htm
<template>
  <FormKit
    validation="(500)username_is_unique"
    :validation-messages="{ username_is_unique({args, name, node}) : string {
        return `${node.value} is already taken!`;
      }}"
    type="text"
    label="Username"
    name="username"
  />
</template>
```

Similarly to the definition of the rule, you should declare the custom rule messages globally if the custom rule is globally available.

```typescript
import type { DefaultConfigOptions } from "@formkit/vue";

const config: DefaultConfigOptions = {
  theme: "genesis",
  messages: {
    en: {
      validation: {
        username_is_unique({ args, name, node }) {
          return `${node.value} is already taken`;
        },
      },
    },
    fr: {
      validation: {
        username_is_unique({ args, name, node }) {
          return `${node.value} est déjà pris`;
        },
      },
    },
  },
  rules: {
    username_is_unique(node) {
      const usernames = ["jpschroeder", "luanguyen", "danielkelly_io"];
      return !usernames.includes(node.value as string);
    },
  },
};

export default config;
```
