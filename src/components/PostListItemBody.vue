<template>
  <div class="post-content">
    <a
      href="#"
      style="margin-left: auto"
      class="link-unstyled"
      title="Make a change"
    >
      <i>Edit</i>
    </a>
    <div>
      <p>
        {{ body }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { body } = defineProps<{ body: string }>();
</script>

<style scoped>
.post-content {
  display: flex;
  flex-direction: column;
}
.post-content p {
  margin-bottom: 2em;
}
.post-content a {
  margin-bottom: 1em;
}
</style>
