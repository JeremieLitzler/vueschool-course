import Vuex from 'vuex';
import Vue from 'vue';

Vue.useAttrs(Vuex);

new Vuex.Store({
  state: {
    products: [],
  },
  getters: {
    productsCount() {
      //calculate a readonly value
    },
  },
  actions: {
    fetchProducs() {
      //make api call
    },
  },
});
