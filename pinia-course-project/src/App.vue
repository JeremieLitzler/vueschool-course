<script setup>
  import TheHeader from "@/components/TheHeader.vue";
  import AppButton from "@/components/AppButton.vue"
  import ProductCard from "@/components/ProductCard.vue";
  import { useProductStore } from "./stores/ProductStore";
  import { useCartStore } from "./stores/CartStore";
  import { ref, reactive } from "vue";

  const productStore = useProductStore();
  const cartStore = useCartStore();
  const cartHistory = reactive([]);
  const futureCart = reactive([]);
  //This is necessary to prevent the $subscribe function to run when we are undoing.
  const doingHistory = ref(false);

  cartHistory.push(JSON.stringify(cartStore.$state));

  const undo = () => {
    //Cannot undo if the history has only the initial value
    if(cartHistory.length === 1) {
      console.log("Nothing to undo...");
      return;
    }

    console.log("Undoing to previous state mutation...");
    doingHistory.value = true;
    futureCart.push(cartHistory.pop());
    cartStore.$state = JSON.parse(cartHistory.at(-1));
    doingHistory.value = false;
  }
  const redo = () => {
    console.log("Redoing to previous state mutation...");
    const latestState = futureCart.pop();
    if (!latestState) {
      console.log("No redo possible because the future is empty...");
      return;
    }
    doingHistory.value = true;
    cartHistory.push(latestState);
    cartStore.$state = JSON.parse(latestState );
    doingHistory.value = false;
  }

  cartStore.$subscribe((mutation, state) => {
    if (!doingHistory.value){
      cartHistory.push(JSON.stringify(state));
      //reset the futureCart not with [] because it is reactive
      //instead, the splice method clears the items from it.
      futureCart.splice(0, futureCart.length);
    }
  });

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
    <div class="mb-5 flex justify-end">
      <AppButton @click="undo">Undo</AppButton>
      <AppButton class="ml-2" @click="redo">Redo</AppButton>
    </div>
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
