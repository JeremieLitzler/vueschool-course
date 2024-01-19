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
    <button v-if="!getCheckoutStatus" @click="store.dispatch('cart/checkout')">
      Checkout
    </button>
    <p v-if="getCheckoutStatus">Your order is successul. Thank you.</p>
    <!-- <p v-if="!store.getters.checkoutStatus">
      Your order failed. Sorry and try again.
    </p> -->
  </div>
</template>

<script setup>
  import { useStore } from 'vuex';
  import { mapGetters } from '@/store/mapStore'
  import useCurrency  from '@/composables/useCurrency'

  const store = useStore();

  const { ["cart/cartContent"]: cartContent, ["cart/cartTotal"]: cartTotal, ["cart/getCheckoutStatus"]: getCheckoutStatus } = mapGetters();

  const updateCartItemQuantity = (cartItem, direction) => {
    store.dispatch('cart/updateCartItemQuantity', {cartItem, direction});
  }
</script>

<style lang="scss" scoped></style>
@/store/mapStore
