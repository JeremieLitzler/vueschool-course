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
    <p v-if="!getCheckoutStatus">Total: {{ useCurrency(cartTotal, '$', 2) }}</p>
    <button v-if="!getCheckoutStatus" @click="store.dispatch('checkout')">
      Checkout
    </button>
    <p v-if="getCheckoutStatus">Your order is successul. Thank you.</p>
    <!-- <p v-if="!store.getters.checkoutStatus">
      Your order failed. Sorry and try again.
    </p> -->
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { useStore } from 'vuex';
  import { mapGetters } from '@/store/mapState'
  import useCurrency  from '@/composables/useCurrency'

  const store = useStore();

  const { cartContent, cartTotal, getCheckoutStatus } = mapGetters();

  const updateCartItemQuantity = (cartItem, direction) => {
    store.dispatch('updateCartItemQuantity', {cartItem, direction});
  }

  const orderSuccessul = ref(false);
</script>

<style lang="scss" scoped></style>
