import NotificationAddRequest from '@/types/NotificationAddRequest';

export default interface FirebaseStorageResponse {
  notification: NotificationAddRequest | null;
  url: string | null;
}
