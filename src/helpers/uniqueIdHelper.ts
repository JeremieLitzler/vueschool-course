import { v4 as uuid } from 'uuid';

export default function uniqueIdHelper() {
  const newUniqueId = uuid();
  return {
    newUniqueId,
  };
}
