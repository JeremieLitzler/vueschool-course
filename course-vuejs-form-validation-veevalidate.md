# Form validation, with Vuelidate

**Remark:** after completing the Masterclass, I was introducted to VeeValidate library and franckly, it is much better and smoothy to use.

Vuelidate is really painless to use, I can confirm. In my first courses at VueSchool, I wasn't familiar with the Composition API so I used the Vuelidate with the Options API and it was OK.

As soon as I moved to Composition API for good and, it becomes even more a problem with TypeScript, using Vuelidate doesn't fit the _painless_ description.

So I am glad to show you this other library _VeeValidate_.

Check out [the documentation to get started](https://vee-validate.logaretm.com/v4/).

## Using a custom plugin

I like the plugin approach that you then register in `main.ts`.

You'll create the plugin in the `plugins` directory and initiliaze it to:

```tsx
import { App } from "vue";
import { Form, Field, ErrorMessage, defineRule, configure } from "vee-validate";

export default (app: App) => {
  app.component("VeeForm", Form);
  app.component("VeeField", Field);
  app.component("VeeErrorMessage", ErrorMessage);
};
```

Then, import the plugin in `marin.ts` and register it:

```tsx
import VeeValidatePlugin from "./plugins/VeeValidatePlugin";
import { createApp } from "vue";
import App from "@/App.vue";

const app = createApp(App);

app.use(VeeValidatePlugin);
app.mount("#app");
```

## Template Usage

Similar to a native form element, you declare the form and its fields.

```htm
<vee-form @submit="save">
  <app-form-field
    name="title"
    label="Title:"
    v-model="form.title"
    rules="required"
    type="text"
  />
  <app-form-field
    as="textarea"
    name="post"
    label="First post:"
    v-model="form.body"
    rules="required"
    rows="8"
    cols="140"
  />
  <div class="btn-group">
    <button @click="cancel" class="btn btn-ghost">Cancel</button>
    <button class="btn btn-blue" type="submit" name="Publish">
      {{ threadExists ? 'Update' : 'Publish' }}
    </button>
  </div>
</vee-form>
```

In the example, `app-form-field` is a wrapper for:

```htm
<template>
  <div class="form-group">
    <label :for="name">{{ label }}</label>
    <vee-field
      :name="name"
      :modelValue="modelValue"
      @input="$emit('modelUpdate', $event)"
      :id="name"
      v-bind="$attrs"
      class="form-input"
    />
    <vee-error-message :name="name" class="error-message" />
  </div>
</template>
```

### The form

In the example, no good to use the `.prevent` on the `@submit` because it takes care of it for you.

```htm
<vee-form @submit="save">
  <!-- The inputs go here -->
  <button @click="cancel" class="btn btn-ghost">Cancel</button>
  <button class="btn btn-blue" type="submit">Submit</button>
</vee-form>
```

### The Inputs

Like take a register form with the previously mentionned `app-form-field` and a `username` input:

```htm
<app-form-field
  name="name"
  label="Name"
  v-model="form.name"
  rules="required|min:3"
  type="text"
/>
```

With _VeeValidate_, you always provide the `name` attribut that identifies the input.

The `label` not only serve the purpose of the actual label element value, but it also can help you customize the validation messages.

You then see the `rules` attribut, in the example, we guess that the input is required and should be 3 characters and more.

I'm going to detail how the rules work and how you can add and customize them fully in the next paragraph.

## Validation

VeeValidate provides the most common rules like `required`, `email`, `url` and a lot. To access them you need to install an additional package:

```bash
npm i @vee-validate/rules
```

Once installed, you declare the rules in the VeeValidate plugin wtih created the beginning by adding:

```tsx
import { defineRule } from "vee-validate";
import { required, email, url, min } from "@vee-validate/rules";
export default (app: App) => {
  defineRule("required", required);
  defineRule("email", email);
  defineRule("url", url);
  defineRule("min", min);
};
```

To use it, you can use the `string` syntax or the `object` syntax:

```htm
<!-- using validation rules with string syntax -->
<app-form-field
  name="username"
  label="Username"
  v-model="form.username"
  rules="required|unique:users,username"
  type="text"
/>
<!-- using validation rules with object syntax -->
<app-form-field
  name="email"
  label="Email"
  v-model="form.email"
  :rules="{
            required: true,
            email: true,
            unique: { collectionName: 'users', prop: 'email' },
          }"
  type="email"
/>
```

The choice is yours really.

The order of validation is implicitly the rules order in the template.

### Custom rules

Let's a rule provided by VeeValidate doesn't, how do you go about?

You define it as a function:

```tsx
defineRule("unique", async <T, S>(value: T, args: S) => {
  let collectionName: string, prop: string, excluding: string;
  if (Array.isArray(args)) {
    [collectionName, prop, excluding] = args;
  } else {
    ({ collectionName, prop, excluding } = args as UniqueRuleArgs);
  }
  if (value === excluding) return true;

  return await firebaseService().isUnique({
    collectionName,
    prop,
    value,
  });
});
```

Above, we validate the unicity of a value against Firebase (`isUnique` is a custom methode to query Firestore from a collection documents that contains the _prop_ passed and searching for the value provided).

Since we can use either `string` or `object` syntax, we need to take care of both ways when parsing the `args` parameter.

The array values or object properties `collectionName`, `prop` and `excluding` are declared first so we can destructure, whatever the use case.

The `UniqueRulesArgs` is only necessary for TypeScript to destructure the `arg` object.

Finally, a rule validates as _valid_ when it returns `true`, so when we want to exclude a certain value, we return `true` (`if (value === excluding) return true;`).

The usage is the following:

```htm
<!-- using validation rules with string syntax -->
<app-form-field
  name="username"
  label="Username"
  v-model="form.username"
  rules="unique:users,username"
  type="text"
/>
```

or with litteral string:

```htm
<!-- using validation rules with string syntax -->
<app-form-field
  name="username"
  label="Username"
  v-model="form.username"
  :rules="`unique:users,username,${user.usermane}`"
  type="text"
/>
```

or with the object syntax:

```tsx
<!-- using validation rules with object syntax -->
<app-form-field
  name="email"
  label="Email"
  v-model="form.email"
  :rules="{
            required: true,
            email: true,
            unique: { collectionName: 'users', prop: 'email', excluding: user.username },
          }"
  type="email"
/>
```

### Error Handling

_VeeValidate_ provides a `ErrorMessage` component, that I named `VeeErrorMessage` to avoid confusion.

```htm
<vee-field
  :name="name"
  :modelValue="modelValue"
  @input="$emit('modelUpdate', $event)"
  :id="name"
  v-bind="$attrs"
  class="form-input"
/>
<vee-error-message :name="name" class="error-message" />
```

VeeValidate tighly links the input and the error message through the `name` attribut.

They need to share the same name.

When the input doesn't validate the rules (on blur, e..g. when the user leaves the input), the message, custom or not will appear to the user.

That's all you need to do. Easy, isn't it?

## Configure validation messages

To customize the validation messages, you'll need `@vee-validate/i18n`.

```bash
npm i @vee-validate/i18n
```

VeeValidate provides a method `configure` that takes an options object that contains a `generateMessage` property.

That property will take the `localize` result from `@vee-validate/i18n`.

```tsx
export default (app: App) => {
  /***
   * The defineRule are placed above the configure
   */

  configure({
    generateMessage: localize("en", {
      messages: {
        /**
         * {field} is either the value of the name attribut
         * or the value of the label attribut defined on the
         * form field.
         */
        required: "The {field} is required",
        email: "The {field} must be a valid email",
        url: "The {field} must be a valid URL.",
        min: "The {field} must be 0:{min} characters long",
        unique: "The {field} is already taken.",
      },
    }),
  });
};
```

## Want to know more

Just go and [visit the documentation site](https://vee-validate.logaretm.com/v4/guide/overview/).
