import Post from '@/types/Post';
import { OrderByDirection } from '@/enums/OrderByDirection';

export default interface PropsPostList {
  posts: Post[];
  orderBy?: OrderByDirection;
}
