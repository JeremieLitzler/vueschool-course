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
        <slot name="additional-user-info" :userObj="item"></slot>
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
