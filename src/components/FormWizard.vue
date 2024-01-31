<template>
  <div>
    <KeepAlive>
      <component
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
    isUserDataFilled() {
      return this.form.email && this.form.name && this.form.password;
    },
    isAddressFilled() {
      return this.form.recipient && this.form.address;
    },
    isLastStep() {
      return this.steps.length - 1 === this.currentStepIndex;
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
    goNext() {
      this.currentStepNumber++;
      this.enableNextStep = this.isLastStep ? false : this.isDataFilled;
    },
    processStep({ data, isValid }) {
      Object.assign(this.form, data);
      this.enableNextStep = isValid;
      console.log("processStep > ", isValid);
    },
  },
};
</script>
