// import UniqueEntity from '@/types/UniqueEntity';
import PostEdited from '@/types/PostEdited';

interface Post /*extends UniqueEntity*/ {
  id?: string;
  edited?: PostEdited;
  publishedAt?: number;
  text?: string;
  threadId?: string;
  userId?: string;
  reactions?: Object;
}

export default Post;
