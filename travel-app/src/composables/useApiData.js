import { ref } from 'vue';
import usePageRequests from './usePageRequests';

export default function useApiData(endpoint) {
  const { makeRequest } = usePageRequests();

  const destination = ref({});
  const fetchDestination = async () => {
    destination.value = await makeRequest(
      `https://travel-dummy-api.netlify.app/${endpoint}.json`,
    );
  };

  return {
    destination,
    fetchDestination,
  };
}
