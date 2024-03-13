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

<script setup lang="ts">
interface AppFormFieldProps {
  name: string;
  label: string;
  modelValue: string;
}

const { name, label, modelValue } = withDefaults(
  defineProps<AppFormFieldProps>(),
  {
    modelValue: '',
  }
);
</script>

<style scoped></style>
