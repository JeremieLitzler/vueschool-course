import PostEdited from '@/types/PostEdited';
import WithId from './WithId';
import { Timestamp } from '@firebase/firestore';

interface Post extends WithId {
  // id?: string;
  edited?: PostEdited;
  publishedAt?: number | Timestamp;
  text?: string;
  threadId?: string;
  userId?: string;
  reactions?: Object;
}

export default Post;
