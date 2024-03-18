import { ref } from 'vue';
import { defineStore } from 'pinia';
// import arraySearchHelper from '@/helpers/arraySearchHelper';
import type Category from '@/types/Category';
import { useCommonStore } from '@/stores/CommonStore';
import { FirestoreCollection } from '@/enums/FirestoreCollection';

// const { findById } = arraySearchHelper();

export const useCategoryStore = defineStore('CategoryStore', () => {
  //STATE
  const categories = ref<Category[]>([]);

  //GETTERS
  const getCategoryById = (categoryId: string | undefined): Category => {
    const match = categories.value.find(
      (category: Category) => category.id === categoryId
    );
    if (match === undefined) return { id: '' };

    return match;
  };

  //ACTIONS
  const fetchCategory = (id: string): Promise<Category> => {
    return useCommonStore().fetchItem<Category>({
      targetStore: categories,
      collection: FirestoreCollection.Categories,
      id,
    });
  };
  const fetchAllCategories = (): Promise<Category[]> => {
    return useCommonStore().fetchAllItems<Category>({
      targetStore: categories,
      collection: FirestoreCollection.Categories,
    });
  };
  return { categories, getCategoryById, fetchCategory, fetchAllCategories };
});
