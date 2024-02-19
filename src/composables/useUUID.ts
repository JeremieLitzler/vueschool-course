import { v4 as uuid } from 'uuid';

export default function useUUID() {
  const newUniqueId = uuid();
  return {
    newUniqueId,
  };
}
