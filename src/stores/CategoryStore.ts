import { ref } from 'vue';
import { defineStore } from 'pinia';
import useSampleData from '@/composables/useSampleData';
import type Category from '@/types/Category';

const { categoriesData } = useSampleData();

export const useCategoryStore = defineStore('CategoryStore', () => {
  //STATE
  const categories = ref(categoriesData);

  //GETTERS
  const getCategoryById = (categoryId: string | undefined): Category => {
    const match = categories.value.find(
      (category: Category) => category.id === categoryId
    );
    if (match === undefined) return {};

    return match;
  };

  return { categories, getCategoryById };
});
