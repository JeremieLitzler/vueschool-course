import { ref } from 'vue';
import { defineStore } from 'pinia';
// import useSampleData from '@/helpers/sampleData';
// import useArraySearchHelper from '@/helpers/arraySearchHelper';
import type Category from '@/types/Category';
import { useCommonStore } from '@/stores/CommonStore';
import { FirestoreCollection } from '@/enums/FirestoreCollection';

// const { categoriesData } = useSampleData();
// const { findById } = useArraySearchHelper();

export const useCategoryStore = defineStore('CategoryStore', () => {
  //STATE
  const categories = ref<Category[]>([]);

  //GETTERS
  const getCategoryById = (categoryId: string | undefined): Category => {
    const match = categories.value.find(
      (category: Category) => category.id === categoryId
    );
    if (match === undefined) return {};

    return match;
  };

  //ACTIONS
  const fetchAllCategories = (): Promise<Category[]> => {
    return useCommonStore().fetchAllItems<Category>({
      targetStore: categories,
      collection: FirestoreCollection.Categories,
    });
  };
  return { categories, getCategoryById, fetchAllCategories };
});
