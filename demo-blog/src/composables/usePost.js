import { ref } from 'vue';

export default function usePost() {
  const apiUrl = 'https://jsonplaceholder.typicode.com/posts';
  const posts = ref([]);
  const post = ref(null);
  const fetchAll = async () => {
    const response = await fetch(apiUrl);
    posts.value = await response.json();
  };

  const fetchOne = async (id) => {
    const response = await fetch(`${apiUrl}/${id}`);
    post.value = await response.json();
  };

  return {
    post,
    posts,
    fetchOne,
    fetchAll,
  };
}
