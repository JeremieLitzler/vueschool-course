<template>
  <section>
    <ul class="userlist-simple">
      <li v-for="item in userlist" :key="item.email">
        <slot name="listitem" :user="item">
          <img
            width="48"
            height="48"
            :src="item.picture.large"
            :alt="item.name.first + ' ' + item.name.last"
          />
          <slot name="first" :text="item.name.first"></slot>
          <slot name="last" :text="item.name.last"></slot>
          <slot
            name="full"
            :text="`${item.name.first} ${item.name.last}`"
          ></slot>
          <slot
            name="fullWithTitle"
            :text="`${item.name.title} ${item.name.first} ${item.name.last}`"
          ></slot>
          <slot name="additional-user-info" :userObj="item"></slot>
        </slot>
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
