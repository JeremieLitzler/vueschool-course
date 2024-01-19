export default {
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
  isProductInStock() {
    return (product) => product.inventory > 0;
  },
  productInventoryMessage() {
    return (product) =>
      product.inventory > 0 ? `${product.inventory} left` : 'Out of stock';
  },
  getCheckoutStatus(state) {
    return state.checkoutStatus;
  },
};
