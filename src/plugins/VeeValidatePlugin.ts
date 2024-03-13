import { App } from 'vue';
import { Form, Field, ErrorMessage, defineRule } from 'vee-validate';
import { required } from '@vee-validate/rules';

export default (app: App) => {
  defineRule('required', required);
  app.component('VeeForm', Form);
  app.component('VeeField', Field);
  app.component('VeeErrorMessage', ErrorMessage);
};
