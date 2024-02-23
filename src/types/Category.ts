import WithId from '@/types/WithId';

export default interface Category extends WithId {
  // id?: string;
  forums?: string[];
  name?: string;
  slug?: string;
}
