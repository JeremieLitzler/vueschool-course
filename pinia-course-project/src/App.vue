<script setup>
  import TheHeader from "@/components/TheHeader.vue";
  import ProductCard from "@/components/ProductCard.vue";
  import { useProductStore } from "./stores/ProductStore";
  import {storeToRefs} from "pinia";
  const { products } = storeToRefs(useProductStore());
</script>

<template>
  <div class="container">
    <TheHeader />
    <ul class="sm:flex flex-wrap lg:flex-nowrap gap-5">
      <ProductCard
        v-for="product in products"
        :key="product.name"
        :product="product"
      />
    </ul>
  </div>
</template>
