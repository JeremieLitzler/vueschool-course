import { App } from 'vue';
import { Form, Field, ErrorMessage, defineRule, configure } from 'vee-validate';
import { required, email, min } from '@vee-validate/rules';
import { localize } from '@vee-validate/i18n';
import firebaseService from '@/services/firebaseService';

interface UniqueRuleArgs {
  collectionName: string;
  prop: string;
}

export default (app: App) => {
  defineRule('required', required);
  defineRule('email', email);
  defineRule('min', min);
  defineRule('unique', async <T, A>(value: T, args: A) => {
    let collectionName: string, prop: string;
    if (Array.isArray(args)) {
      [collectionName, prop] = args;
    } else {
      ({ collectionName, prop } = args as UniqueRuleArgs);
    }

    return await firebaseService().isUnique({
      collectionName,
      prop,
      value,
    });
  });

  configure({
    generateMessage: localize('en', {
      messages: {
        required: 'The {field} is required',
        email: 'The {field} must be a valid email',
        min: 'The {field} must be 0:{min} characters long',
        unique: 'The {field} is already taken.',
      },
    }),
  });

  app.component('VeeForm', Form);
  app.component('VeeField', Field);
  app.component('VeeErrorMessage', ErrorMessage);
};
