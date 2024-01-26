import Emoji from "./Emoji";

export default interface JournalEntry {
  id: number;
  body: string;
  emoji: Emoji | null;
  createdAt: Date;
  userId: number;
}
