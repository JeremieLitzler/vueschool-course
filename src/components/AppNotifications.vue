<template>
  <div class="notifications">
    <div
      v-for="notification in notifications"
      :key="notification.id"
      class="notification"
    >
      <span>
        {{ notification.message }}
      </span>
      <button @click="removeNotification(notification.id)">x</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import useNotification from '@/composables/useNotification';
const { notifications, removeNotification } = useNotification();
</script>

<style scoped>
.notifications {
  position: fixed;
  bottom: 20px;
  right: 0;
}
.notification {
  background: white;
  display: flex;
  justify-content: space-between;
  width: 350px;
  box-shadow: 2px 2px 2px 2px rbga(0, 0, 0.5);
  padding: 10px 20px;
  margin-bottom: 5px;
  border-left: 5px solid #263959;
}
</style>
