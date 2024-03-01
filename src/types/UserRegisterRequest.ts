import UserCreateRequest from './UserCreateRequest';

export default interface UserRegisterRequest extends UserCreateRequest {
  password: string;
}
