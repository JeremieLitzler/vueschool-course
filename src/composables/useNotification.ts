import { ref } from 'vue';
import useUUID from '@/helpers/uniqueIdHelper';
import type Notification from '@/types/Notification';
import type NotificationAddRequest from '@/types/NotificationAddRequest';
const notifications = ref<Notification[]>([]);

export default function useNotification() {
  const addNotification = ({
    message,
    timeout = null,
  }: NotificationAddRequest) => {
    const notificationId = useUUID().newUniqueId;
    notifications.value.push({ id: notificationId, message });
    if (timeout) {
      setTimeout(() => removeNotification(notificationId), timeout);
    }
  };
  const removeNotification = (id: string) => {
    const index = notifications.value.findIndex((item) => item.id === id);
    notifications.value.splice(index, 1);
  };
  return {
    notifications,
    addNotification,
    removeNotification,
  };
}
