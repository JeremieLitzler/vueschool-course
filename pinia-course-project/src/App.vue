<script setup>
    import TheHeader from "@/components/TheHeader.vue";
    import ProductCard from "@/components/ProductCard.vue";
    import { useProductStore } from "./stores/ProductStore";
    import { useCartStore } from "./stores/CartStore";

    const productStore = useProductStore();
    const cartStore = useCartStore();
  /**
   *
   */
    cartStore.$onAction(({name, store, args, after, onError }) => {
      if (name === "addToCart"){
        after(() => {
          console.log("onAction", args[0]);
        });
        onError((err) => {
          console.error("onError", err);
        })
      }
    })
    productStore.fill();
</script>

<template>
  <div class="container">
    <TheHeader />
    <ul class="sm:flex flex-wrap lg:flex-nowrap gap-5">
      <ProductCard
        v-for="product in productStore.products"
        :key="product.name"
        :product="product"
        @addToCart="cartStore.addToCart($event, product)"
      />
    </ul>
  </div>
</template>
