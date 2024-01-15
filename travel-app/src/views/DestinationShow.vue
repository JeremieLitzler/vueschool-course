<template>
  <section class="destination">
    <h2>{{ destination.name }}</h2>
    <div class="destination-details">
      <img :src="`/images/${destination.image}`" :alt="destination.name" />
      <p>{{ destination.description }}</p>
    </div>
  </section>
  <section class="experiences">
    <h2>Top experiences in {{ destination.name }}</h2>
    <div class="cards">
      <router-link
        v-for="experience in destination.experiences"
        :key="experience.slug"
        :to="{name:'experience-details', params:{ experienceSlug:experience.slug }}"
      >
        <ExperienceCard :experience="experience" />
      </router-link>
    </div>
    <router-view />
  </section>
</template>

<script setup>
  console.log("Start - destination-show");
  import useSourceData from "@/composables/useSourceData";
  import ExperienceCard from "@/components/ExperienceCard.vue";

  const props = defineProps({
    id:{
      type: Number,
      required: true
    }
  })
  console.log("destination-show > id (props) =", props.id);
  const { destination } = useSourceData(props.id);
  console.log("destination =", destination);
  console.log("End - destination-show");
</script>

<style lang="scss" scoped></style>
