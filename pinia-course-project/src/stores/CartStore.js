import { defineStore } from 'pinia';
import { groupBy } from 'lodash';
import { toRef } from 'vue';

export const useCartStore = defineStore('CartStore', {
  //state
  state: () => {
    return {
      items: [],
    };
  },
  getters: {
    count: (state) => state.items.length,
    isNotEmpty: (state) => state.count > 0,
    groupedItems: (state) => groupBy(state.items, (item) => item.name),
    groupCount: (state) => (name) => state.groupedItems[name].length,
    total: (state) =>
      state.items.reduce((cartTotal, item) => cartTotal + item.price, 0),
  },
  actions: {
    addToCart(count, product) {
      count = parseInt(count);
      console.log('count is', count);
      for (let index = 0; index < count; index++) {
        this.items.push({ ...product });
      }
    },
    removeAllItemsByName(name) {
      this.items = this.items.filter((item) => item.name != name);
    },
  },
});
