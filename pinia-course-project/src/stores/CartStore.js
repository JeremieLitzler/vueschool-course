import { defineStore } from 'pinia';

export const useCartStore = defineStore('CartStore', {
  //state
  state: () => {
    return {
      items: [],
    };
  },
  getters: {
    count: (state) => state.items.length,
    isNotEmpty: (state) => state.count === 0,
  },
  actions: {
    addToCart(count, product) {
      count = parseInt(count);
      console.log('count is', count);
      for (let index = 0; index < count; index++) {
        this.items.push({ ...product });
      }
    },
  },
});
