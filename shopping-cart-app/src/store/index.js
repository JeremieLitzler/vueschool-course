import { createStore } from 'vuex';
import shop from '@/api/shop';

export const store = createStore({
  state: {
    products: [],
  },
  getters: {
    availableProducts(state, getters) {
      return state.products.filter((product) => product.inventory > 0);
    },
  },
  actions: {
    fetchProducts({ commit }) {
      return new Promise((resolve, reject) => {
        shop.getProducts((products) => {
          commit('setProducts', products);
          resolve();
        });
      });
    },
    addToCart({ commit }, product) {
      if (isProductInStock(context, product)) {
        // add to cart
        commit('pushProductToCart', product);
      }

      throw new Error('Product is not in stock... Sorry');
    },
    isProductInStock(context, product) {
      return product.inventory > 0;
    },
  },
  mutations: {
    setProducts(state, products) {
      state.products = products;
    },
    setProducts(state, products) {
      state.products = products;
    },
  },
});
