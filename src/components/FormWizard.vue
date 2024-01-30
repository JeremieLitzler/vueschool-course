<template>
  <div>
    <FormPlanPicker v-if="currentStepNumber === 1" @pickPlan="processStep" />
    <FormUserDetails
      v-if="currentStepNumber === 2"
      @setUserInfo="processStep"
    />
    <FormAddress v-if="currentStepNumber === 3" @setAddress="processStep" />
    <FormReviewOrder v-if="currentStepNumber === 4" />

    <div class="progress-bar">
      <div :style="`width: ${progress}%;`"></div>
    </div>

    <!-- Actions -->
    <div class="buttons">
      <button @click="goBack" v-if="currentStepNumber > 1" class="btn-outlined">
        Back
      </button>
      <button @click="goNext" class="btn">Next</button>
    </div>

    <pre><code>{{form}}</code></pre>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import FormPlanPicker from "@/components/FormPlanPicker.vue";
import FormUserDetails from "@/components/FormUserDetails.vue";
import FormAddress from "@/components/FormAddress.vue";
import FormReviewOrder from "@/components/FormReviewOrder.vue";

const currentStepNumber = ref(1);
const length = ref(4);
const form = ref({
  plan: null,
  email: null,
  name: null,
  password: null,
  address: null,
  recipient: null,
  chocolate: false,
  otherTreat: false,
});

const progress = computed(() => (currentStepNumber.value / length.value) * 100);

const goBack = () => {
  currentStepNumber.value--;
};
const goNext = () => {
  currentStepNumber.value++;
};

const processStep = (stepData) => {
  Object.assign(form.value, stepData);
};
</script>
