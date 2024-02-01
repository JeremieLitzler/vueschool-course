<template>
  <div>
    <h1 class="title">Delivery details</h1>

    <h2 class="subtitle">
      Where should we send your freshly roasted coffee beans?
    </h2>

    <form @input="submitStep" class="form">
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

<script>
import { required } from "vuelidate/lib/validators";
export default {
  props: {
    wizardData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      form: {
        address: null,
        recipient: this.wizardData.name,
      },
    };
  },
  activated() {
    this.form.recipient = this.wizardData.name;
  },
  validations: {
    form: {
      address: {
        required,
      },
      recipient: {
        required,
      },
    },
  },
  methods: {
    submitStep() {
      this.$v.$touch(); // to display the error on the parent, we need to touch.
      return new Promise((resolve, reject) => {
        if (!this.$v.$invalid) {
          //resolve if data is valid
          resolve({
            address: this.form.address,
            recipient: this.form.recipient,
          });
        } else {
          //reject if data is invalid
          reject("Plan not selected");
        }
      });
    },
  },
};
</script>

<style scoped></style>
