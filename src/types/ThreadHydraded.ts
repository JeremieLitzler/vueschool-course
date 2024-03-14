import Thread from '@/types/Thread';

export default interface ThreadHydraded extends Thread {
  author: string;
  repliesCount: number;
  threadJustCreated: boolean;
  contributorsCount: number;
}
