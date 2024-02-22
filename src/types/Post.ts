import PostEdited from '@/types/PostEdited';
import WithId from './WithId';

interface Post extends WithId {
  // id?: string;
  edited?: PostEdited;
  publishedAt?: number;
  text?: string;
  threadId?: string;
  userId?: string;
  reactions?: Object;
}

export default Post;
