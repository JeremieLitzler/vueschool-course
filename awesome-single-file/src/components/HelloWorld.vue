<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <!--
      See https://vuejs.org/style-guide/rules-strongly-recommended.html#component-name-casing-in-templates
      Component name casing in templates
    -->
    <button @click="showUsername = !showUsername">Toggle Usernale</button>
    <div v-if="showUsername">
      <BigYellowUsername username="JeremieLitzler" />
    </div>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  data() {
    return {
      showUsername: false,
    };
  },
  components: {
    BigYellowUsername: () =>
      import(
        /* webpackChunkName: "BigYellowUsername" */ "@/components/BigYellowUsername.vue"
      ),
  },
  methods: {
    toggle() {
      this.showUsername = true;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
