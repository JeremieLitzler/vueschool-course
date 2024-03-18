import { ref } from 'vue';
import uniqueIdHelper from '@/helpers/uniqueIdHelper';
import type Notification from '@/types/Notification';
import type NotificationAddRequest from '@/types/NotificationAddRequest';
import { NotificationType } from '@/enums/NotificationType';
const notifications = ref<Notification[]>([]);

export default function useNotification() {
  const addNotification = ({
    message,
    timeout = 5000,
    type = NotificationType.Info,
  }: NotificationAddRequest) => {
    const notificationId = uniqueIdHelper().newUniqueId;
    notifications.value.push({ id: notificationId, message, type });
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
