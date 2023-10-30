# Form validation, with Vuelidate

Vuelidate is light and easy to use.

See [the documentation](https://vuelidate.js.org/).

## `$error` in Vuelidate

It is a shorthand for`$invalid` = True && `$dirty` = True.

## To handle error messages and when to display them

You can either let Vuelidate handle the transition to _dirty state_ using the `$model`.

```htm
<label for="age"
              >Age:
              <input
                type="number"
                id="age"
                v-model.number="$v.form.age.$model"
              />
            </label>
```

Or decide which input should get dirty or not using `$touch()` method:

```htm
<label for="age"
              >Age:
              <input
                type="number"
                id="age"
                v-model.number="form.age"
                @input="$v.form.age.$touch()"
              />
            </label>
```

A good practice is to `touch()` of the form on the click on the submit button for a form.

```javascript
    submitFormWithVuelidate() {
      this.$v.form.$touch();
      if (!this.$v.form.$invalid) {
        console.log(this.form);
      } else {
        console.error('❌ The form is invalid !');
      }
    },
```

You could replace `this.$v.form.$touch()` with `this.$v.$touch()`, but since a good practice is to regroup the inputs under a single form object, it is better to use the touch method on the form in order not to mess with other data.

## UX about when to show error messages

Displaying the error messages as the user types is not great UX.

It is better to display them when the user exit the input (e.g. focus out).

## Validators responsibility

An empty input is valid if not required. So use the following logic to force Vuelidate to check for null:

```javascript
      // ex: field = $v.form.someInput
      // below we check the field:
      //  > is not invalid
      //  > is not empty
      return !field.$invalid && field.$model;
```

## Clean templates

When you have a big form, having dynamic classes can clutter the template.

```htm
            <input
              type="email"
              v-model="form.email"
              @blur="$v.form.email.$touch()"
              :class="{error: $v.form.email.$error, valid: !$v.form.email.$invalid && form.email}"
              id="email"
            />
```

It is good practice to put the logic in a method instead, if possible reused across all inputs.

In the template:

```htm
            <input
              type="email"
              v-model="form.email"
              @blur="$v.form.email.$touch()"
              :class="{error: $v.form.email.$error, valid: shouldAppendValidClass($v.form.email)}"
              id="email"
            />
```

In the method:

```javascript
  methods: {
    shouldAppendValidClass(field) {
      // ex: field = $v.form.someInput
      // below we check the field:
      //  > is not invalid
      //  > is not empty
      return !field.$invalid && field.$model;
    },
  }
```

In the code above, we could do the same thing on the error class as a consistent practice in the application.

Since you may have multiple forms with similar inputs, you can export those helper methods to a mixin or a plugin.

**_TODO: How do you export those helper methods to a mixin or a plugin_**

## About custom validators

Sometimes, youu will need custom validators.

They need a key and be defined with a function, as follows:

```javascript
      food: {
        pizzaOrBurger: (value) =>
          value === 'pizza' ||
          value === 'burger' ||
          // the following prevent the input to be considered as required
          // if you want the input to be required, don't add the condition.
          !validators.helpers.req(value),
      },

```

**Tip 1:** It is good practice to extrac custom validators to their own files.

**Tip 2:** You can also extract validators using built-in validators.

For example, you could have that

```javascript
// ... in the validators declaration
      age: {
        between: validators.between(12, 120),
      },

```

Turn into this:

```javascript
// ... in another file
const oldEnoughAndAlive = validators.between(12, 120);

// ... in the validators declaration
      age: {
        oldEnoughAndAlive
      },
```

## Conditional validation

You can apply conditional validation as below:

```javascript
      email: {
        email: validators.email,
        required: validators.requiredIf(function () {
          return !!this.form.newsletter;
        }),
      },
```

**BE CAREFUL**: use a regular javascript function so it works and not an arrow function. Why? Because the function is bound to the component instance. You would not have access to it with an arrow function.

### Asynchronous validation

It is possible that some fields may require validation from API calls.

We need to implement it as follows.

- in the template:

```htm
            <label for="github-username"
              >GitHub username:
              <input
                v-model.lazy="$v.form.githubUsername.$model"
                :class="{error: shouldAppendErrorClass($v.form.githubUsername), valid: shouldAppendValidClass($v.form.githubUsername)}"
                id="github-username"
              />
            </label>

```

- in the component validators's:

```javascript
      githubUsername: {
        exists(value) {
          if (!validators.helpers.req(value)) {
            return true;
          }
          return axios.get(`//api.github.com/users/${value}`);
        },
      },
```

Above, if we had `v-model="$v.form.githubUsername.$model"` instead of `v-model.lazy="$v.form.githubUsername.$model"` (note the `lazy`), every keystroke would call the API because we bind `v-model` to `$v.form.githubUsername.$model` and it is reactive.

With lazy, the validator will be called only once the user focus out of the input.

> Thank you, says the API 😁
