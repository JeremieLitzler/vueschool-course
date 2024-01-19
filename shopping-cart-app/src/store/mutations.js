export default {
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
  setCheckoutStatus(state, status) {
    state.checkoutStatus = status;
  },
  emptyCart(state) {
    state.cart = [];
  },
};
