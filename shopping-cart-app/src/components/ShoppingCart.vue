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
    <p v-if="!store.getters.getCheckoutStatus">
      Total: {{ useCurrency(cartTotal, '$', 2) }}
    </p>
    <button
      v-if="!store.getters.getCheckoutStatus"
      @click="store.dispatch('checkout')"
    >
      Checkout
    </button>
    <p v-if="store.getters.getCheckoutStatus">
      Your order is successul. Thank you.
    </p>
    <!-- <p v-if="!store.getters.checkoutStatus">
      Your order failed. Sorry and try again.
    </p> -->
  </div>
</template>

<script setup>
  import { computed, ref } from 'vue';
  import { useStore } from 'vuex';
  import useCurrency  from '@/composables/useCurrency'

  const store = useStore();

  const cartContent = computed(() => store.getters.cartContent);
  const cartTotal = computed(() => store.getters.cartTotal);

  const updateCartItemQuantity = (cartItem, direction) => {
    store.dispatch('updateCartItemQuantity', {cartItem, direction});
  }

  const orderSuccessul = ref(false);
</script>

<style lang="scss" scoped></style>
