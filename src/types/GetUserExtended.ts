import Post from './Post';
import Thread from './Thread';
import User from './User';

export default interface GetUserExtented {
  instance?: User;
  posts?: Post[];
  postsCount?: number;
  threads?: Thread[];
  threadsCount?: number;
}
