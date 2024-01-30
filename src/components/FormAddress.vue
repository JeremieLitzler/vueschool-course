<template>
  <div>
    <h1 class="title">Delivery details</h1>

    <h2 class="subtitle">
      Where should we send your freshly roasted coffee beans?
    </h2>

    <form class="form">
      <div class="form-group">
        <label class="form-label" for="delivery_name">Name</label>
        <input
          v-model="$v.form.recipient.$model"
          type="text"
          placeholder="Recipients Name"
          class="form-control"
          id="delivery_name"
        />
        <div v-if="$v.form.recipient.$error" class="error">
          field is required
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="address">Address</label>
        <textarea
          v-model="$v.form.address.$model"
          placeholder="London Street 470978 New England"
          rows="3"
          class="form-control"
          id="address"
        ></textarea>
        <div v-if="$v.form.address.$error" class="error">field is required</div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";

const form = ref({
  address: null,
  recipient: null,
});

const rules = {
  form: {
    address: {
      required,
    },
    recipient: {
      required,
    },
  },
};
const $v = useVuelidate(rules, form);
</script>

<style scoped></style>
