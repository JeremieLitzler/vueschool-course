import PostEdited from "./PostEdited";
interface Post {
  id?: string;
  edited?: PostEdited;
  publishedAt?: number;
  text?: string;
  threadId?: string;
  userId?: string;
  reactions?: Object;
}

export default Post;
