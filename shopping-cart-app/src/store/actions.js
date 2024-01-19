import shop from '@/api/shop';

export default {
  fetchProducts({ commit }) {
    return new Promise((resolve, reject) => {
      shop.getProducts((products) => {
        commit('setProducts', products);
        resolve();
      });
    });
  },
  addProductToCart({ state, commit, getters }, product) {
    commit('setCheckoutStatus', false);

    if (!getters.isProductInStock(product)) {
      throw new Error('Product is out of stock... sorry!');
    }

    const cartItem = state.cart.find((item) => item.product.id === product.id);

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
        dispatch('fetchProducts');
      },
      () => {
        commit('setCheckoutStatus', false);
      },
    );
  },
};
