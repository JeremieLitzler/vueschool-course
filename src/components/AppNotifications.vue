<template>
  <div class="notifications">
    <transition-group name="notification">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="notification"
        :class="`notification-type-${notification.type}`"
      >
        <span>
          {{ notification.message }}
        </span>
        <button @click="removeNotification(notification.id)">x</button>
      </div>
    </transition-group>
  </div>
</template>

<script>
import useNotification from "@/composables/useNotification";
export default {
  setup() {
    const { notifications, removeNotification } = useNotification();

    return { notifications, removeNotification };
  },
};
</script>

<style lang="css" scoped>
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
}
.notification-enter-active,
.notification-leave-active {
  transition: all 0.5s ease;
}
.notification-enter-from,
.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
.notification-move {
  transition: transform 0.8s ease;
}
.notification-type-info {
  border-left: 5px solid #263959;
}
.notification-type-warning {
  border-left: 5px solid #f19a16;
}
.notification-type-error {
  border-left: 5px solid #f80707;
}
</style>
