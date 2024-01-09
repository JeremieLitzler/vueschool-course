import { ref } from 'vue';
import useSourceApi from './useSourceApi';

export default function useUser(endpoint) {
  const { apiUrlBase } = useSourceApi();
  const items = ref([]);
  const item = ref(null);
  const fetchAll = async () => {
    const response = await fetch(`${apiUrlBase}/${endpoint}`);
    items.value = await response.json();
  };

  const fetchOne = async (id) => {
    const response = await fetch(`${apiUrlBase}/${endpoint}/${id}`);
    item.value = await response.json();
  };

  return {
    item,
    items,
    fetchOne,
    fetchAll,
  };
}
