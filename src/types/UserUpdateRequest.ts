import User from '@/types/User';

export default interface UserUpdateRequest {
  userUpdated: User;
  updatedAvatar: File;
  id: string;
}
