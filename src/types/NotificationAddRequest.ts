import { NotificationType } from '@/enums/NotificationType';

export default interface Notification {
  message: string;
  timeout?: number | null;
  type: NotificationType;
}
