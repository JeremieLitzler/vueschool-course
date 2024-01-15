<template>
  <section>
    <h2>{{ experience.name }}</h2>
    <img :src="`/images/${experience.image}`" :alt="experience.name" />
    <p>{{ experience.description }}</p>
  </section>
</template>

<script setup>
  console.log("Start - experience-show");
  import { reactive } from "vue";
  import useSourceData from "@/composables/useSourceData";

  const props = defineProps({
    id:{
      type: Number,
      required: true
    },
    experienceSlug: {
      type: String,
      required: true
    }
  });
  const { destination } = useSourceData(props.id);
  console.log("experience show > destination=", destination);
  console.log("experience show > props.experienceSlug =", props.experienceSlug);
  const experienceMatch = destination.experiences.find(element => element.slug === props.experienceSlug);
  console.log("experience show > experienceMatch =", experienceMatch);
  const experience = reactive(experienceMatch);
  console.log("End - experience-show");
</script>

<style lang="scss" scoped></style>
