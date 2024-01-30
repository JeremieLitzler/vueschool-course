<template>
  <div>
    <h1 class="title">Delivery details</h1>

    <h2 class="subtitle">
      Where should we send your freshly roasted coffee beans?
    </h2>

    <form class="addressForm">
      <div class="addressForm-group">
        <label class="addressForm-label" for="delivery_name">Name</label>
        <input
          @blur="submitAddressData"
          v-model="addressForm.recipient"
          type="text"
          placeholder="Recipients Name"
          class="addressForm-control"
          id="delivery_name"
        />
        <div v-if="v$.addressForm.recipient.$error" class="error">
          field is required
        </div>
      </div>

      <div class="addressForm-group">
        <label class="addressForm-label" for="address">Address</label>
        <textarea
          @blur="submitAddressData"
          v-model="addressForm.address"
          placeholder="London Street 470978 New England"
          rows="3"
          class="addressForm-control"
          id="address"
        ></textarea>
        <div v-if="v$.addressForm.address.$error" class="error">
          field is required
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";

const addressForm = ref({
  address: null,
  recipient: null,
});

const rules = {
  addressForm: {
    address: {
      required,
    },
    recipient: {
      required,
    },
  },
};

const v$ = useVuelidate(rules, addressForm);

const emit = defineEmits(["setAddress"]);
const submitAddressData = () => {
  emit("setAddress", addressForm.value);
};
</script>

<style scoped></style>
