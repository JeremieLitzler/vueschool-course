import { App } from 'vue';
import { Form, Field, ErrorMessage, defineRule, configure } from 'vee-validate';
import { required, email, url, min } from '@vee-validate/rules';
import { localize } from '@vee-validate/i18n';
import firebaseAuthService from '@/services/firebaseAuthService';

interface UniqueRuleArgs {
  collectionName: string;
  prop: string;
  excluding: string;
}

const veeValidatePlugin = {
  install(app: App) {
    defineRule('required', required);
    defineRule('email', email);
    defineRule('url', url);
    defineRule('min', min);
    defineRule('unique', async <T, A>(value: T, args: A) => {
      let collectionName: string, prop: string, excluding: string;
      if (Array.isArray(args)) {
        [collectionName, prop, excluding] = args;
      } else {
        ({ collectionName, prop, excluding } = args as UniqueRuleArgs);
      }
      if (value === excluding) return true;

      return await firebaseAuthService().isUnique({
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
          url: 'The {field} must be a valid URL.',
          min: 'The {field} must be 0:{min} characters long',
          unique: 'The {field} is already taken.',
        },
      }),
    });

    app.component('VeeForm', Form);
    app.component('VeeField', Field);
    app.component('VeeErrorMessage', ErrorMessage);
  },
};

export default veeValidatePlugin;
