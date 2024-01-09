<template>
  <span>{{ prettyPrice }}</span>
</template>

<script>
  import { computed, inject, ref } from "vue";

  export default {
    props: {
        price: Number,
    },
    setup(props){
        const currencySymbol = inject('currencySymbol', ref("$"));
        const prettyPrice = computed(() => `${currencySymbol.value}${props.price.toFixed(2)}`);
        return { prettyPrice };
    }
  };
</script>

<style lang="scss" scoped></style>
