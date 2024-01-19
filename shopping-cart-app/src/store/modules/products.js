import shop from '@/api/shop';

export default {
  namespaced: true,
  state: {
    saleableProducts: [],
  },
  getters: {
    availableProducts(state) {
      return state.saleableProducts;
    },
    isProductInStock() {
      return (product) => product.inventory > 0;
    },
    productInventoryMessage() {
      return (product) =>
        product.inventory > 0 ? `${product.inventory} left` : 'Out of stock';
    },
  },
  actions: {
    fetchProducts({ state, commit }) {
      return new Promise((resolve, reject) => {
        shop.getProducts((products) => {
          console.log(
            'actions > fetchProducts > products from API =',
            products,
          );
          commit('setProducts', products);
          console.log(
            'actions > fetchProducts > state.products =',
            state.saleableProducts,
          );
          resolve();
        });
      });
    },
  },
  mutations: {
    setProducts(state, products) {
      console.log('mutations > setProducts > products input =', products);

      state.saleableProducts = products;
    },
    decrementProductInventory(state, product) {
      product.inventory--;
    },
    incrementProductInventory(state, product) {
      product.inventory++;
    },
  },
};
