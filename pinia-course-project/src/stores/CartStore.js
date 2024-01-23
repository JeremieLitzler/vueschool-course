import { defineStore, acceptHMRUpdate } from 'pinia';
import { groupBy } from 'lodash';
import { useAuthUserStore } from './AuthUserStore';

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
    groupedItems: (state) => {
      const groups = groupBy(state.items, (item) => item.name);
      const sortedGroups = Object.keys(groups).sort();
      let inOrder = {};
      sortedGroups.forEach((key) => (inOrder[key] = groups[key]));
      return inOrder;
    },
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
    updateQuantityItem(count, item) {
      this.removeAllItemsByName(item.name);
      this.addToCart(count, item);
    },
    checkout() {
      const authUserStore = useAuthUserStore();
      alert(
        `${authUserStore.username} just bought ${this.count} items at a total of $${this.total}`,
      );
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCartStore, import.meta.hot));
}
