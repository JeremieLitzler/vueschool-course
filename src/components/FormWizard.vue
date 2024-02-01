<template>
  <div>
    <div v-if="wizardInProgress" v-show="asyncState !== 'pending'">
      <KeepAlive>
        <component
          ref="currentStepComponent"
          :is="steps[currentStepIndex]"
          @updateAsyncState="updateAsyncState"
          :wizard-data="form"
        />
      </KeepAlive>

      <div class="progress-bar">
        <div :style="`width: ${progress}%;`"></div>
      </div>

      <!-- Actions -->
      <div class="buttons">
        <button
          @click="goBack"
          v-if="currentStepNumber > 1"
          class="btn-outlined"
        >
          Back
        </button>
        <button @click="nextButtonAction" class="btn">
          {{ isLastStep ? "Complete order" : "Next" }}
        </button>
      </div>

      <pre><code>{{form}}</code></pre>
    </div>
    <div v-else>
      <h1 class="title">Thank you!</h1>
      <h2 class="subtitle">We look forward to shipping you your first box!</h2>

      <p class="text-center">
        <a href="https://vueschool.io" target="_blank" class="btn"
          >Go somewhere cool, {{ form.name }}!</a
        >
      </p>
    </div>
    <div class="loading-wrapper" v-if="asyncState === 'pending'">
      <div class="loader">
        <img src="/spinner.svg" alt="" />
        <p>Please wait, we're hitting our servers!</p>
      </div>
    </div>
  </div>
</template>

<script>
import FormPlanPicker from "./FormPlanPicker";
import FormUserDetails from "./FormUserDetails";
import FormAddress from "./FormAddress";
import FormReviewOrder from "./FormReviewOrder";

import { postFormToDB } from "../api/index";

export default {
  name: "FormWizard",
  components: {
    FormPlanPicker,
    FormUserDetails,
    FormAddress,
    FormReviewOrder,
  },
  data() {
    return {
      currentStepNumber: 1,
      steps: [
        "FormPlanPicker",
        "FormUserDetails",
        "FormAddress",
        "FormReviewOrder",
      ],
      form: {
        plan: null,
        email: null,
        name: null,
        password: null,
        address: null,
        recipient: null,
        chocolate: false,
        otherTreat: false,
      },
      asyncState: null,
    };
  },
  computed: {
    currentStepIndex() {
      return this.currentStepNumber - 1;
    },
    length() {
      return this.steps.length;
    },
    progress() {
      return (this.currentStepNumber / this.length) * 100;
    },
    isUserDataFilled() {
      return this.form.email && this.form.name && this.form.password;
    },
    isAddressFilled() {
      return this.form.recipient && this.form.address;
    },
    isLastStep() {
      return this.steps.length === this.currentStepNumber;
    },
    wizardInProgress() {
      return this.currentStepNumber <= this.length;
    },
    isDataFilled() {
      return this.isUserDataFilled || this.isAddressFilled;
    },
  },
  methods: {
    updateAsyncState(state) {
      this.asyncState = state;
    },
    goBack() {
      this.currentStepNumber--;
      this.enableNextStep = true;
    },
    nextButtonAction() {
      console.log(
        "nextButtonAction > this.$refs",
        this.$refs.currentStepComponent
      );
      this.$refs.currentStepComponent
        .submitStep()
        .then((data) => {
          console.log("nextButtonAction > resolve");
          //update the form data
          Object.assign(this.form, data);
          //go to the next step
          if (this.isLastStep) {
            this.submitOrder();
          } else {
            this.goNext();
          }
        })
        .catch((err) => {
          //handle the error
          console.log("nextButtonAction > reject");
          console.error(err);
          //going to the next step isn't possible
        });
    },
    goNext() {
      this.currentStepNumber++;
    },
    submitOrder() {
      this.asyncState = "pending";
      postFormToDB(this.form).then(() => {
        console.log("Form submitted", this.form);
        this.asyncState = "success";
        this.currentStepNumber++;
      });
    },
  },
};
</script>
