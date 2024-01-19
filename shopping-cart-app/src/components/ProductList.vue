<template>
  <div>
    <h1>Product List</h1>
    <p v-if="loading">Loading...</p>
    <ul v-else>
      <li v-for="product in products" :id="product.id">
        {{ product.title }} |
        {{ useCurrency(product.price, '$', 2) }}
        ({{ productInventoryMessage(product) }})
        <button
          @click="addProductToCart(product)"
          :disabled="!isProductInStock(product)"
        >
          Add to cart
        </button>
      </li>
    </ul>
    <p v-if="!loading && (!products ||products.length === 0)">
      No product for sales... 🤨
    </p>
  </div>
</template>

<script setup>
    import { ref } from 'vue';
    import { useStore } from 'vuex';
    import { mapGetters } from '@/store/mapStore'
    import useCurrency  from '@/composables/useCurrency'

    const store = useStore();

  // mapState();
  // mapGetters();
  // mapActions();
  // mapMutations();

    const loading = ref(true);
    store.dispatch("products/fetchProducts").then(() => {
      console.log("Products loaded...");
      loading.value = false
    });

    const { ["products/availableProducts"]: products, ["products/isProductInStock"]: isProductInStock, ["products/productInventoryMessage"]: productInventoryMessage } = mapGetters();

    console.log("Setup > ProducList comp = ", products);

    const addProductToCart = (product) => {
      store.dispatch('cart/addProductToCart', product);
    }
</script>

<style lang="scss" scoped></style>
@/store/mapStore
