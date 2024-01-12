import { reactive } from 'vue';
import sourceData from '@/data.json';

export default function useSourceData(slug) {
  const destinations = reactive(sourceData.destinations);

  const destination = reactive(
    sourceData.destinations.find((element) => element.slug === slug),
  );
  return {
    destination,
    destinations,
  };
}
