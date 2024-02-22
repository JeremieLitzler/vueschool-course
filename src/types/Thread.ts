import WithId from '@/types/WithId';

export default interface Thread extends WithId {
  contributors?: string[];
  firstPostId?: string;
  forumId?: string;
  lastPostAt?: number;
  lastPostId?: string;
  posts?: string[];
  publishedAt?: number;
  slug?: string;
  title?: string;
  userId?: string;
  // id?: string;
}
