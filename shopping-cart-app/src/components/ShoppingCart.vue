<template>
  <div>
    <h1>Shopping Cart</h1>
    <ul>
      <li v-for="cartItem in cartContent" :id="cartItem.id">
        {{ cartItem.product.title }} @
        {{ useCurrency(cartItem.product.price, '$', 2) }} x
        {{ cartItem.quantity }}
        <button @click="updateCartItemQuantity(cartItem, 'increase')">+</button>
        /
        <button @click="updateCartItemQuantity(cartItem, 'decrease')">-</button>
      </li>
    </ul>
    <p>Total: {{ useCurrency(cartTotal, '$', 2) }}</p>
  </div>
</template>

<script setup>
  import { computed } from 'vue';
  import { useStore } from 'vuex';
  import useCurrency  from '@/composables/useCurrency'

  const store = useStore();

  const cartContent = computed(() => store.getters.cartContent);
  const cartTotal = computed(() => store.getters.cartTotal);

  const updateCartItemQuantity = (cartItem, direction) => {
    store.dispatch('updateCartItemQuantity', {cartItem, direction});
  }
</script>

<style lang="scss" scoped></style>
