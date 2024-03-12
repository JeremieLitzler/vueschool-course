import useUUID from "@/helpers/uniqueIdHelper";
import { ref } from "vue";
const notifications = ref([]);

export default function useNotification() {
  const addNotification = ({ message, timeout = 5000, type = "info" }) => {
    const notificationId = useUUID().createId();
    notifications.value.push({ id: notificationId, message, type });

    if (timeout) {
      setTimeout(() => removeNotification(notificationId), timeout);
    }
  };
  const removeNotification = (id) => {
    const index = notifications.value.findIndex((item) => item.id === id);
    notifications.value.splice(index, 1);
  };
  return {
    notifications,
    addNotification,
    removeNotification,
  };
}
