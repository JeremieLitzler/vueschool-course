# Dynamic Forms with Vue.js

## Form wizard and dynamic components

When you have a wizard (e.g. multi-step) form, you may end up with a bloated wizard component.

You could have 4 steps:

```javascript
<FormPlanPicker
    v-if="currentStepNumber === 1"
    @sendStepData="processStep"
/>
<FormUserDetails
    v-if="currentStepNumber === 2"
    @sendStepData="processStep"
/>
<FormAddress
    v-if="currentStepNumber === 3" @sendStepData="processStep"
/>
<FormReviewOrder
    v-if="currentStepNumber === 4"
    @sendStepData="processStep"
/>
```

Using dynamic components, you would end up with:

```javascript
<component
    :is="steps[currentStepIndex]"
    @sendStepData="processStep"
    :wizard-data="form"
/>
```

The data property is defined as an array:

```javascript
  data() {
    return {
      currentStepNumber: 1,
      steps: [
        "FormPlanPicker",
        "FormUserDetails",
        "FormAddress",
        "FormReviewOrder",
      ],
    }
  }
```

And the `currentStepIndex` is calculated from the `currentStepNumber` data property :

```javascript
computed: {
    currentStepIndex() {
      return this.currentStepNumber - 1;
    },
}
```

## Using `keep-alive`

When you have a wizard form, you may to keep keep the data entered on a previous step in memory so that you handle well the case when the user uses a back button.

The built-in `<keep-alive>` component helps preserve a dynamic component's state.

In the previous example, the code becomes:

```javascript
<keep-alive>
    <component
        :is="steps[currentStepIndex]"
        @sendStepData="processStep"
        :wizard-data="form"
    />
</keep-alive>
```

Read [more in the docs](https://vuejs.org/v2/guide/components-dynamic-async.html#keep-alive-with-dynamic-components).

## Preserving Component State

Going back and forth using the dynamic component has also messed up the `Next` button logic.

We need to tell the parent component (the wizard) about the vuelidate validation state (is it invalid or not).

For example, before, we had this:

```javascript
    setAddress() {
      if (!this.$v.$invalid) {
        this.$emit("sendStepData", {
          address: this.form.address,
          recipient: this.form.recipient,
        });
      }
    },
```

We need to emit this way now:

```javascript
    setAddress() {
      this.$emit("sendStepData", {
        data: {
          address: this.form.address,
          recipient: this.form.recipient,
        },
        isValid: !this.$v.$invalid,
      });
    },
```

Of course, since we use the same custon event, all child components need to send the same data.

In the parent component, we end up with the following:

```javascript
    processStep({ data, isValid }) {
      Object.assign(this.form, data);
      this.enableNextStep = isValid;
      console.log("processStep > ", isValid);
    },
```

Another issue is that the `goNext` must listen to the whole data. In [the lesson](https://vueschool.io/lessons/preserve-component-state-vuejs), it didn't happen and I had to add a few computed properties to handle going back from the start (see [this commit and file](https://github.com/JeremieLitzler/vueschool-course/commit/b239982fd7eab4a73a9e532998177967d7ea9309#diff-0e1c3e5effb99a35faff2fdc6a70b1b1d0feacc151d5e9fa1ce1792aaeb0ffe6))

The next lesson [Control Child Component Through refs
](https://vueschool.io/lessons/control-child-component-through-refs) provide another approach.

## Control Child Component Through `refs`

To make it work, each child component must have:

- the same `ref` attribut. Since we are using a dynamic component, the value is the same.

```javascript
<keep-alive>
    <component
        ref="currentStep"
        :is="steps[currentStepIndex]"
        @sendStepData="processStep"
        :wizard-data="form"
    />
</keep-alive>
```

- the `$v` (vuelidate instance) available.
  - For the child components that have a form and declare validation rules, `$v` is available.
  - For the child components that don't have a form, you can simply declare the validation rules as an empty object.

If you don't want that on the step before of the wizard, just check the `$v` is set.

Back to the wizard, the idea is to be able to fix the going back several steps and going forward and have the next step to be enable when the data isn't changed and was already validated.

To achieve that, the parent component wants to know from the child component is the form is valid.

Using `nextTick` method, we achieve that. `nextTick` is called after the next DOM update cycle.

The `goNext` method looks like this:

```javascript
    goNext() {
      this.currentStepNumber++;
      //this.enableNextStep = this.isLastStep ? false : this.isDataFilled;
      this.$nextTick(() => {
        this.enableNextStep =
          this.$refs.currentStep.$v //for the step before last that has no validations but is a step in the wizard
          && this.$refs.currentStep.$v.$invalid;
      });
    },
```

## Vue.js Watchers and the Activated Hook With `keep-alive`

As you implement `keep-alive`, you need to be aware that, if data from a step in the wizard is used in a following step to _prefill_, then changing the related input data in step N won't trigger an update in the step N+1.

Using a watcher, you can solve that.

```javascript
  watch: {
    //everytime the parent form receives an update on wizardData.name by the component of step N,
    //then the watch is triggered on the component of step N+1
    "wizardData.name"(value) {
      this.form.recipient = value;
    },
  },
```

It might however create performance issues as the component of step N+1 is inactive when the wath is trigger.

A cheaper option in terms of performance is the following: using the `activited` lifecycle hook.

```javascript
activated() {
    this.form.recipient = this.wizardData.name;
  },
```

Again, this is only applicable when you are related data between two steps.

If the step N+1 is fed from step N data, be aware that updating automatically the form data of step N+1 may override user data. Maybe, prefer offering the user a choice with a CTA to autofill the related inputs.

## Alternative to custom events in multi-step forms

While the event-based approach works, e.g. the children tells the parent when data is updated, you can also use the Promises to have the parent ask the children if they have all the data needed to go forward.

The algorithm is:

- each `setData` method in each step component will return a promise that:
  - resolve if the data is valid.
  - reject otherwise.

This approch is necessary when steps contain ayynchronous actions.

```javascript
let stepPromise = new Promise((resolve, reject) => {
  //resolve if data is valid
  //reject if data is invalid
});

//In the parent
stepPromise
  .then(() => {
    //update the form data
    //go to the next step
  })
  .catch(() => {
    //handle the error
    //going to the next step isn't possible
  });
```
