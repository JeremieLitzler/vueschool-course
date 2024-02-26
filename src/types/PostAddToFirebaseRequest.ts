import { Timestamp } from 'firebase/firestore';
import PostAddRequest from '@/types/PostAddRequest';

export default interface PostAddToFirebaseRequest extends PostAddRequest {
  publishedAt: Timestamp;
  userId: string;
}
