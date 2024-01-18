<template>
  <div>
    <h1>Product List</h1>
    <p v-if="loading">Loading...</p>
    <ul v-else>
      <li v-for="product in products" :id="product.id">
        {{ product.title }} - {{ product.price }}
      </li>
    </ul>
  </div>
</template>

<script setup>
  import { computed, ref } from 'vue';
  import { useStore } from 'vuex';

  const store = useStore();

  const loading = ref(true);

  store.dispatch("fetchProducts").then(() => loading.value = false);

  const products = computed(() => store.getters.availableProducts);
</script>

<style lang="scss" scoped></style>
