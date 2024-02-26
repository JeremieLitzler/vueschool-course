import Post from '@/types/Post';
import Thread from '@/types/Thread';
import User from '@/types/User';

export default interface GetUserExtented extends User {
  posts?: Post[];
  threadsCount?: number;
  threadsList?: Thread[];
}
