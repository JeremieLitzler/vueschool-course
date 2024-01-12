import { reactive } from 'vue';
import sourceData from '@/data.json';

export default function useSourceData() {
  const destinations = reactive(sourceData.destinations);
  return {
    destinations,
  };
}
