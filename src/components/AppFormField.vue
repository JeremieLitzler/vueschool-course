<template>
  <div class="form-group">
    <label :for="name">{{ label }}</label>
    <vee-field
      :name="name"
      :modelValue="modelValue"
      @input="$emit('modelUpdate', $event)"
      :id="name"
      v-bind="$attrs"
      class="form-input"
    />
    <vee-error-message :name="name" class="error-message" />
  </div>
</template>

<script>
export default {
  props: {
    name: { type: String, required: true },
    label: { type: String, required: true },
    modelValue: { type: String, default: "" },
  },
};
</script>

<style lang="css" scoped></style>
