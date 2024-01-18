<template>
  <div class="home">
    <h1>All destinations</h1>
    <button @click="triggerRouterError">Trigger router error</button>
    <section class="destinations">
      <router-link
        v-for="destination in destinations"
        :key="destination.id"
        :to="{name: 'destination-show', params:{id:destination.id, slug:destination.slug}}"
      >
        <h2>{{ destination.name }}</h2>
        <img :src="`/images/${destination.image}`" :alt="destination.name" />
        <!-- <p>{{destination.description }}</p> -->
      </router-link>
    </section>
  </div>
</template>

<script setup>
  import { reactive } from "vue";
  import sourceData from "@/data.json";
  console.log(sourceData);
  const destinations = reactive(sourceData.destinations);

  import { NavigationFailureType, isNavigationFailure, useRouter } from "vue-router";
  const router = useRouter();
  const triggerRouterError = async () => {
    //let navigate to the home page while on the home page...
    const navigationResult = await router.push('/');
    console.log(navigationResult);
    if (isNavigationFailure(navigationResult, NavigationFailureType.duplicated)) {
      //the route is the current and cannot be navigated to
    }
    else if (isNavigationFailure(navigationResult, NavigationFailureType.aborted)) {
      //false is returned in a navigation guard
    }
    else if (isNavigationFailure(navigationResult, NavigationFailureType.cancelled)) {
      //a new navigation took place before the current could finish.
    }
    else {
      //all was fine.
    }
  }
</script>

<style lang="scss" scoped></style>
