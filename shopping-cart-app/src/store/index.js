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
    cartContent(state) {
      return state.cart.map((cartItem) => {
        const product = state.products.find(
          (product) => product.id === cartItem.product.id,
        );
        return {
          product,
          quantity: cartItem.quantity,
        };
      });
    },
    cartTotal(state, getters) {
      let total = 0;
      getters.cartContent.forEach((cartItem) => {
        total += cartItem.product.price * cartItem.quantity;
      });
      //   return getters.cartContent.reduce(
      //     (total, product) => total + cartItem.product.price * cartItem.quantity,
      //     0,
      //   );
      return total;
    },
    isProductAvailable(state, product) {
      const match = state.products.find((item) => item.id === product.id);
      return match || match.inventory > 0;
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

      const cartItem = state.cart.find(
        (item) => item.product.id === product.id,
      );

      if (!cartItem) {
        // If product not in current cart
        // add to cart new product
        commit('pushProductToCart', product);
      } else {
        // increment quantity
        commit('incrementCartItemQuantity', cartItem);
      }
      commit('decrementProductInventory', product);
    },
    updateCartItemQuantity({ commit, getters }, { cartItem, direction }) {
      console.log(direction);
      if (direction === '+' && getters.isProductAvailable(product)) {
        commit('incrementCartItemQuantity', cartItem);
        commit('decrementProductInventory', cartItem.product);
      } else {
        commit('decrementCartItemQuantity', cartItem);
        commit('incrementProductInventory', cartItem.product);
      }
    },
  },
  mutations: {
    setProducts(state, products) {
      state.products = products;
    },
    pushProductToCart(state, product) {
      state.cart.push({
        product,
        quantity: 1,
      });
    },
    decrementCartItemQuantity(state, cartItem) {
      cartItem.quantity--;
    },
    decrementProductInventory(state, product) {
      product.inventory--;
    },
    incrementCartItemQuantity(state, cartItem) {
      cartItem.quantity++;
    },
    incrementProductInventory(state, product) {
      product.inventory++;
    },
    updateQuantity(state, cartItem) {},
  },
});
