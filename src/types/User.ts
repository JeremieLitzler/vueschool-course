// import UniqueEntity from '@/types/UniqueEntity';

export default interface User /*extends UniqueEntity*/ {
  id?: string;
  avatar?: string;
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
}
