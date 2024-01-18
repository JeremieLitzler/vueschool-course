<template>
  <div>
    <h1>Product List</h1>
    <ul>
      <li v-for="product in products" :id="product.id">
        {{ product.title }} - {{ product.price }}
      </li>
    </ul>
  </div>
</template>

<script setup>
  import { computed } from 'vue';
  import shop from '@/api/shop';
  import store from '@/store/index';

  const products = computed(() => store.state.products);

  shop.getProducts(products => {
    store.commit('setProducts', products)
  })
</script>

<style lang="scss" scoped></style>
