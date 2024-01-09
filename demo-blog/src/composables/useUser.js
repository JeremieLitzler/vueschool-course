import { ref } from 'vue';
import useSourceApi from './useSourceApi';

export default function useUser() {
  const { apiUrlBase, apiUrlUserEndpoint } = useSourceApi();
  const users = ref([]);
  const user = ref(null);
  const fetchAll = async () => {
    const response = await fetch(apiUrl);
    users.value = await response.json();
  };

  const fetchOne = async (id) => {
    const response = await fetch(`${apiUrlBase}${apiUrlUserEndpoint}/${id}`);
    user.value = await response.json();
  };

  return {
    user,
    users,
    fetchOne,
    fetchAll,
  };
}
