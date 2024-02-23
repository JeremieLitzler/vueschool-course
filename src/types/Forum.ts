import WithId from '@/types/WithId';
export default interface Forum extends WithId {
  // id?: string;
  categoryId?: string;
  description?: string;
  lastPostId?: string;
  name?: string;
  slug?: string;
  threads?: string[];
}
