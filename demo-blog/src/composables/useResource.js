import { ref } from 'vue';
import useSourceApi from './useSourceApi';
import usePageRequests from './usePageRequests';

export default function useUser(endpoint) {
  const { apiUrlBase } = useSourceApi();
  const { makeRequest } = usePageRequests();
  const items = ref([]);
  const item = ref(null);
  const fetchAll = async () => {
    items.value = await makeRequest(`${apiUrlBase}/${endpoint}`);
  };

  const fetchOne = async (id) => {
    item.value = await makeRequest(`${apiUrlBase}/${endpoint}/${id}`);
  };

  return {
    item,
    items,
    fetchOne,
    fetchAll,
  };
}
