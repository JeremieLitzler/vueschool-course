// This create the instance of Pinia to be used in the router's navigation guards.
// Inspired by https://stackoverflow.com/a/70714477

import { createPinia } from 'pinia';

const pinia = createPinia();

export default pinia;
