<template>
  <div class="card">
    <div class="additional">
      <figure class="avatar">
        <img :src="user.avatar" :alt="user.name" />
      </figure>
    </div>
    <div class="more-info">
      <h2>{{ user.name }}</h2>
      <h3>{{ user.role }}</h3>
      <p>{{ user.bio }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Card",

  props: {
    user: Object,
  },
};
</script>
