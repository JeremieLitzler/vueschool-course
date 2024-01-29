<template functional>
  <div>
    <h1>User Card</h1>
    <div class="center">
      <div class="card">
        <div class="additional">
          <figure class="avatar">
            <img :src="user.avatar" :alt="user.name" />
          </figure>
        </div>
        <div class="more-info">
          <h1>{{ user.name }}</h1>
          <h3>{{ user.role }}</h3>
          <p>{{ user.bio }}</p>
        </div>
      </div>
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
