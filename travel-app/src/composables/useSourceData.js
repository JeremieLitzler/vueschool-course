import { reactive } from 'vue';
import sourceData from '@/data.json';

console.log('sourceData =', sourceData);
export default function useSourceData(destinationId) {
  const destinations = reactive(sourceData.destinations);

  console.log('useSourceData > destinationId', destinationId);
  const destinationMatch = sourceData.destinations.find(
    (element) => element.id === parseInt(destinationId),
  );
  console.log('useSourceData > destinationMatch', destinationMatch);
  const destination =
    destinationId === undefined ? reactive({}) : reactive(destinationMatch);

  return {
    destination,
    destinations,
  };
}
