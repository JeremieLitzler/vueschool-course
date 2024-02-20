import Thread from './Thread';

export default interface AppendThreadToUserRequest {
  userId: string;
  thread: Thread;
}
