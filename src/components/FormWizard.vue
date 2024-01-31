<template>
  <div>
    <component
      :is="steps[currentStepIndex]"
      @sendStepData="processStep"
      :wizard-data="form"
    />

    <div class="progress-bar">
      <div :style="`width: ${progress}%;`"></div>
    </div>

    <!-- Actions -->
    <div class="buttons">
      <button @click="goBack" v-if="currentStepNumber > 1" class="btn-outlined">
        Back
      </button>
      <button :disabled="!enableNextStep" @click="goNext" class="btn">
        Next
      </button>
    </div>

    <pre><code>{{form}}</code></pre>
  </div>
</template>

<script>
import FormPlanPicker from "./FormPlanPicker";
import FormUserDetails from "./FormUserDetails";
import FormAddress from "./FormAddress";
import FormReviewOrder from "./FormReviewOrder";
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
  },
  methods: {
    goBack() {
      this.currentStepNumber--;
    },
    goNext() {
      this.currentStepNumber++;
      this.enableNextStep = false;
      console.log("goNext > enableNextStep", this.enableNextStep);
    },
    processStep(stepData) {
      Object.assign(this.form, stepData);
      this.enableNextStep = true;
      console.log("processStep > enableNextStep", this.enableNextStep);
    },
  },
};
</script>
