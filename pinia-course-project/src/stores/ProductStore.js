import { defineStore } from 'pinia';

export const useProductStore = defineStore('ProductStore', {
  //state
  state: () => {
    return {
      products: [],
    };
  },
  actions: {
    async fill() {
      //This is a dynamic import, therefore you need to use the ".default" to access the data
      this.products = (await import('@/data/products.json')).default;
    },
  },
  //getters
});
