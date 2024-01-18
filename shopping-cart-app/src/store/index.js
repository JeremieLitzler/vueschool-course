import Vuex from 'vuex';

export default new Vuex.Store({
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
  mutations: {
    setProducts(state, products) {
      state.products = products;
    },
  },
});
