import WithId from '@/types/WithId';
import WithName from './WithName';

export default interface Category extends WithId, WithName {
  // id?: string;
  forums?: string[];
  slug?: string;
}
