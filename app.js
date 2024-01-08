Vue.createApp({
  data() {
    return {
      header: 'Shopping list app',
      editing: false,
      newItem: '',
      newItemHighPriority: false,
      items: [
        { id: 1, label: 'Food', purchased: true, highPriority: true },
        { id: 2, label: 'Tools', purchased: false, highPriority: true },
        { id: 3, label: 'Paper', purchased: true, highPriority: false },
      ],
    };
  },
  methods: {
    saveitem() {
      this.items.push({
        id: this.items.length + 1,
        label: this.newItem,
        highPriority: this.newItemHighPriority,
      });
      this.clearInputs();
    },
    doEdit(editing) {
      this.editing = editing;
      this.clearInputs();
    },
    togglePurchase(item) {
      item.purchased = !item.purchased;
    },
    clearInputs() {
      this.newItem = '';
      this.newItemHighPriority = false;
    },
  },
}).mount('#shopping-list');
