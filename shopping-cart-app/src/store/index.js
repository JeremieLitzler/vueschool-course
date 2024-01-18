import { createStore } from 'vuex';
import shop from '@/api/shop';

export const store = createStore({
  state: {
    products: [],
    //contains {id, quantity}
    cart: [],
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
    addProductToCart({ state, commit }, product) {
      if (product.inventory === 0) {
        throw new Error('Product is out of stock... sorry!');
      }

      const cartItem = state.cart.find((item) => item.id === product.id);

      if (!cartItem) {
        // If product not in current cart
        // add to cart new product
        commit('pushProductToCart', product);
      } else {
        // increment quantity
        commit('incrementItemQuantity', cartItem);
      }
      commit('decrementProductInventory', product);
    },
  },
  mutations: {
    setProducts(state, products) {
      state.products = products;
    },
    pushProductToCart(state, product) {
      state.cart.push({ id: product.id, quantity: 1 });
    },
    incrementItemQuantity(state, cartItem) {
      cartItem.quantity++;
    },
    decrementProductInventory(state, product) {
      product.inventory--;
    },
  },
});
