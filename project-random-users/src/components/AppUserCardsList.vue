<template>
  <section>
    <ul class="userlist-simple">
      <li v-for="item in userlist" :key="item.email">
        <img
          width="48"
          height="48"
          :src="item.picture.large"
          :alt="item.name.first + ' ' + item.name.last"
        />
        <p>{{ item.name.first }}</p>
      </li>
    </ul>
  </section>
</template>

<script>
    export default {
  props: {
    userlist: {
      type: Array,
      default: null
    }
  },
    }
</script>

<style scoped></style>
