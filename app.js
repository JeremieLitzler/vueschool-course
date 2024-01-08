Vue.createApp({
  data() {
    return {
      header: 'Shopping list app',
      editing: false,
      newItem: '',
      newItemHighPriority: false,
      items: [
        // {id: 1, label: "Food"}, {id:2, label:"Tools"}, {id:3, label: "Paper"}
      ],
    };
  },
  methods: {
    saveitem() {
      this.items.push({ id: this.items.length + 1, label: this.newItem });
      this.clearInputs();
    },
    doEdit(editing) {
      this.editing = editing;
      this.clearInputs();
    },
    clearInputs() {
      this.newItem = '';
    },
  },
}).mount('#shopping-list');
