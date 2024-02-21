// import UniqueEntity from '@/types/UniqueEntity';
export default interface Forum /*extends UniqueEntity*/ {
  categoryId?: string;
  description?: string;
  lastPostId?: string;
  name?: string;
  slug?: string;
  threads?: string[];
  id?: string;
}
