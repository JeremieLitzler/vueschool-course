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
  import { ref } from 'vue';
  import shop from '@/api/shop';

  const products = ref([]);

  shop.getProducts(data => {
    products.value = data;
  });
</script>

<style lang="scss" scoped></style>
