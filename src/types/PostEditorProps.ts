import Post from '@/types/Post';

export default interface PostEditorProps {
  sourcePost: Post | null;
  threadId?: string;
}
