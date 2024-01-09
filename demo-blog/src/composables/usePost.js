import { ref } from 'vue';
import useSourceApi from './useSourceApi';

export default function usePost() {
  const { apiUrlBase, apiUrlPostEndpoint } = useSourceApi();

  const apiUrl = 'https://jsonplaceholder.typicode.com/posts';
  const posts = ref([]);
  const post = ref(null);
  const fetchAll = async () => {
    const response = await fetch(`${apiUrlBase}${apiUrlPostEndpoint}`);
    posts.value = await response.json();
  };

  const fetchOne = async (id) => {
    const response = await fetch(`${apiUrlBase}${apiUrlPostEndpoint}/${id}`);
    post.value = await response.json();
  };

  return {
    post,
    posts,
    fetchOne,
    fetchAll,
  };
}
