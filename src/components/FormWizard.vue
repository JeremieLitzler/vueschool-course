<template>
  <div>
    <div v-if="wizardInProgress">
      <KeepAlive>
        <component
          ref="currentStep"
          :is="steps[currentStepIndex]"
          @sendStepData="processStep"
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
        <button
          :disabled="!enableNextStep"
          @click="nextButtonAction"
          class="btn"
        >
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
      enableNextStep: false,
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
    goBack() {
      this.currentStepNumber--;
      this.enableNextStep = true;
    },
    nextButtonAction() {
      if (this.isLastStep) {
        this.submitOrder();
      } else {
        this.goNext();
      }
    },
    goNext() {
      console.log("goNext > this.$refs.currentStep", this.$refs.currentStep);
      this.currentStepNumber++;
      //this.enableNextStep = this.isLastStep ? false : this.isDataFilled;
      this.$nextTick(() => {
        console.log(
          "goNext > nextTick > this.$refs.currentStep",
          this.$refs.currentStep
        );
        console.log(
          "goNext > nextTick > this.$refs.currentStep.$v.$invalid",
          this.$refs.currentStep.$v.$invalid
        );
        this.enableNextStep =
          //this.$refs.currentStep.$v &&
          !this.$refs.currentStep.$v.$invalid;
      });
    },
    processStep({ data, isValid }) {
      Object.assign(this.form, data);
      this.enableNextStep = isValid;
    },
    submitOrder() {
      postFormToDB(this.form).then(() => {
        console.log("Form submitted", this.form);
        this.currentStepNumber++;
      });
    },
  },
};
</script>
