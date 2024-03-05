import UserCreateRequest from '@/types/UserCreateRequest';

export default interface UserGoogleSigninRequest extends UserCreateRequest {
  uid: string;
  exists: Object;
}
