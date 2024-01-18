import Vuex from 'vuex';

export default new Vuex.Store({
  state: {
    products: [],
  },
  getters: {
    availableProducts(state, getters) {
      return state.products.filter((product) => product.inventory > 0);
    },
  },
  actions: {
    fetchProducts() {
      //make api call
    },
  },
  mutations: {
    setProducts(state, products) {
      state.products = products;
    },
  },
});
