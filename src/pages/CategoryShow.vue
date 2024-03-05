<template>
  <div class="col-full push-top">
    <router-link :to="{ name: RouteName.TheHome }">⬅️ Back to Home</router-link>

    <h1>
      {{ category.name }}
    </h1>
  </div>

  <ForumList :categoryId="category.id" :forums="categoryForums" />
</template>

<script>
import ForumList from "@/components/ForumList.vue";
import { useRouteName } from "@/helpers/routeNameEnum";
/* eslint-disable */
const { RouteName } = useRouteName();
/* eslint-enable */

export default {
  components: { ForumList },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return { RouteName };
  },
  computed: {
    categories() {
      return this.$store.state.categories;
    },
    category() {
      const match = this.categories.find((item) => item.id === this.id);
      return match;
    },
    categoryForums() {
      return this.$store.state.forums.filter(
        (forum) => forum.categoryId === this.category.id
      );
    },
  },
  async beforeCreate() {
    //console.log("CategoryShow > created > categoryId >", this.id);
    //this.$store.dispatch("notifyAppIsReady");
    const category = await this.$store.dispatch("fetchCategory", {
      id: this.$route.params.id,
    });
    //console.log("CategoryShow > created > category", category);
    await this.$store.dispatch("fetchForums", {
      ids: category.forums,
    });

    this.$store.dispatch("notifyAppIsReady");
  },
};
</script>

<style lang="scss" scoped></style>
