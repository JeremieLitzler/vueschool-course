<script setup lang="ts">
  import { ref, computed } from 'vue'

  const header = ref('Shopping list app')
  const items = ref([]);

  const reverseItems = computed(() => {
    return [...items.value.reverse()];
  });
  const newItem = ref("");
  const newItemHighPriority = ref(false);

  const editing = ref(false);

  const characterCount = computed(() => {
    return newItem.value.length
  });

  const  saveItem = () => {
    items.value.push({
      id: items.value.length + 1,
      label: newItem.value,
      highPriority: newItemHighPriority.value,
      purchased: false
    });
    clearInputs();
  }

  const doEdit = (isEditing: boolean) => {
    editing.value = isEditing;
    clearInputs();
  }

  const togglePurchase = (item) => {
    item.purchased = !item.purchased;
  }

  const clearInputs = () => {
    newItem.value = '';
    newItemHighPriority.value = false;
  }
</script>
<template>
  <div class="header">
    <h1>{{ header || "Welcome!" }}</h1>
    <button class="btn btn-cancel" v-if="editing" @click="doEdit(false)">
      Cancel
    </button>
    <button class="btn btn-primary" v-else @click="doEdit(true)">
      Add item
    </button>
  </div>
  <form class="add-item-form" v-if="editing" @submit.prevent="saveItem">
    <label>
      Name
      <input type="text" placeholder="Add an item" v-model="newItem" />
      <p v-if="characterCount > 0">{{characterCount}}/200</p>
    </label>
    <label>
      <input
        type="checkbox"
        name="priorityHigh"
        v-model="newItemHighPriority"
      />
      High priority
    </label>
    <button class="btn btn-primary" :disabled="newItem.length === 0">
      Save item
    </button>
  </form>
  <ul>
    <!-- For loop with destructuring of object items 
  <li
    v-for="{id, label, purchased, highPriority} in items"
    :key="id"
  >
  {{label}}
  </li>
  -->
    <li
      v-for="item in reverseItems"
      :key="item.id"
      :class="{strikeout: item.purchased, priority: item.highPriority}"
      @click="togglePurchase(item)"
    >
      {{item.label}}
    </li>
  </ul>
  <p v-if="items.length === 0">Nice job! You've bought everything.</p>
</template>

<style>
  body {
    background: #eff8ff;
    height: 100vh;
    width: 100vw;
    font-family: system-ui, BlinkMacSystemFont, -apple-system, Segoe UI, Roboto,
      Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    padding: 0;
  }

  .counter {
    font-size: 0.8rem;
    padding-left: 10px;
    padding-right: 10px;
  }

  #shopping-list {
    background: #fff;
    padding: 2rem;
    margin: 1rem;
    border-radius: 3px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.12), 0 2px 4px 0 rgba(0, 0, 0, 0.08);
    width: 95%;
    max-width: 900px;
  }

  h1 {
    color: #3d4852;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  a {
    color: #6cb2eb;
    font-size: 1.25rem;
    transition: all 0.1s ease-in;
    margin-top: 0.5rem;
    display: block;
  }

  a:hover {
    color: #3490dc;
  }

  li,
  p {
    display: flex;
    align-items: center;
    line-height: 1.75;
    letter-spacing: 0.5px;
    color: #3d4852;
    font-size: 1.25rem;
    cursor: pointer;
    transition: all 0.1s ease-in;
  }

  li:hover {
    color: #22292f;
  }

  li input {
    margin: 0 0.5rem 0;
  }

  #shopping-list > input,
  #shopping-list > select {
    width: 100%;
    border-radius: 3px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
    border: 1px solid #f1f5f8;
    color: #606f7b;
    padding: 0.5rem 0.75rem;
    box-sizing: border-box;
    font-size: 1rem;
    letter-spacing: 0.5px;
    margin: 0.5rem 0;
  }

  .add-item-form,
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .add-item-form input {
    width: 70%;
    border-radius: 3px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
    border: 1px solid #f1f5f8;
    color: #606f7b;
    padding: 0.5rem 0.75rem;
    box-sizing: border-box;
    font-size: 1rem;
    letter-spacing: 0.5px;
    margin: 0.5rem 0;
  }

  .btn {
    border: none;
    border-radius: 3px;
    margin: auto 0;
    padding: 0.5rem 0.75rem;
    flex-shrink: 0;
    cursor: pointer;
    font-size: 0.9rem;
    letter-spacing: 0.5px;
    transition: all 0.1s ease-in;
  }

  .btn[disabled] {
    background: #8795a1;
  }

  .btn[disabled]:hover {
    background: #606f7b;
  }

  .btn-primary {
    background: #6cb2eb;
    color: #fff;
  }

  .btn-primary:hover {
    background: #3490dc;
  }

  .btn-cancel {
    background: #ef5753;
    color: #fff;
  }

  .btn-cancel:hover {
    background: #e3342f;
    color: #fff;
  }

  .strikeout {
    text-decoration: line-through;
    color: #b8c2cc;
  }

  .strikeout:hover {
    color: #8795a1;
  }

  .priority {
    color: #de751f;
  }
</style>
