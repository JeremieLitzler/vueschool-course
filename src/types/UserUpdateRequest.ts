import User from '@/types/User';

export default interface UserUpdateRequest {
  userUpdated: User;
  id: string;
}
