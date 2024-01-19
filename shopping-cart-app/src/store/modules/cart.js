import shop from '@/api/shop';

export default {
  namespaced: true,
  state: {
    //contains {id, quantity}
    cart: [],
    checkoutStatus: false,
  },
  getters: {
    cartContent(state, getters, rootState) {
      return state.cart.map((cartItem) => {
        const product = rootState.products.saleableProducts.find(
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
      //With reduce:
      // return getters.cartContent.reduce((total, product) => total + cartItem.product.price * cartItem.quantity, 0);
      return total;
    },
    getCheckoutStatus(state) {
      return state.checkoutStatus;
    },
  },
  actions: {
    addProductToCart(
      { state, commit, getters, rootState, rootGetters },
      product,
    ) {
      commit('setCheckoutStatus', false);

      if (!rootGetters['products/isProductInStock'](product)) {
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
      commit('products/decrementProductInventory', product, { root: true });
    },
    updateCartItemQuantity({ commit, getters }, { cartItem, direction }) {
      console.log(direction);
      if (direction === '+' && getters.isProductInStock(product)) {
        commit('incrementCartItemQuantity', cartItem);
        commit('decrementProductInventory', cartItem.product);
      } else {
        commit('decrementCartItemQuantity', cartItem);
        commit('incrementProductInventory', cartItem.product);
      }
    },
    checkout({ state, commit, dispatch }) {
      shop.buyProducts(
        state.cart,
        () => {
          commit('emptyCart');
          commit('setCheckoutStatus', true);
          dispatch('products/fetchProducts', null, { root: true });
        },
        () => {
          commit('setCheckoutStatus', false);
          throw new Error('Checkout failed... Try again!');
        },
      );
    },
  },
  mutations: {
    pushProductToCart(state, product) {
      state.cart.push({
        product,
        quantity: 1,
      });
    },
    decrementCartItemQuantity(state, cartItem) {
      cartItem.quantity--;
    },
    incrementCartItemQuantity(state, cartItem) {
      cartItem.quantity++;
    },
    updateQuantity(state, cartItem) {},
    setCheckoutStatus(state, status) {
      state.checkoutStatus = status;
    },
    emptyCart(state) {
      state.cart = [];
    },
  },
};
