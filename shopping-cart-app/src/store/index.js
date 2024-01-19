import { createStore } from 'vuex';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';

export const store = createStore({
  state: {
    products: [],
    //contains {id, quantity}
    cart: [],
    checkoutStatus: false,
  },
  getters,
  actions,
  mutations,
});
