import { createStore } from 'vuex';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';
import cart from './modules/cart';
import products from './modules/products';

export const store = createStore({
  // namespaced: true,
  modules: {
    products,
    cart,
  },
  state: {
    appName: 'Shopping Cart',
  },
  getters,
  actions,
  mutations,
  strict: true,
});
