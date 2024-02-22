import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useCommonStore = defineStore('CommonStore', () => {
  //STATE
  const fetching = ref(false);

  const updateFetching = () => !fetching.value;

  return {
    fetching,
    updateFetching,
  };
});
