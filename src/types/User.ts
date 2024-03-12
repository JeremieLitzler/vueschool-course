import WithId from '@/types/WithId';

export default interface User extends WithId {
  // id?: string;
  avatar?: string | null;
  email?: string;
  lastVisitAt?: number;
  name?: string;
  isModerator?: boolean;
  registeredAt?: number;
  username?: string;
  usernameLower?: string;
  twitter?: string;
  website?: string;
  bio?: string;
  location?: string;
  postsCount?: number;
  threads?: string[];
}
