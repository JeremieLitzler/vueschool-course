// import UniqueEntity from '@/types/UniqueEntity';

interface Thread /*extends UniqueEntity*/ {
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
  id?: string;
}

export default Thread;
