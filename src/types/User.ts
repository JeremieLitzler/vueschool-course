export default interface User {
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
}
