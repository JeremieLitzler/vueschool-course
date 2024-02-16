import type Category from '@/types/Category';
import useSampleData from '@/composables/useSampleData.ts';

const { categoriesData } = useSampleData();

export default function usCategory() {
  const getCategoryById = (categoryId: string | undefined): Category => {
    const match = categoriesData.value.find(
      (category: Category) => category.id === categoryId
    );
    if (match === undefined) return {};

    return match;
  };

  return {
    getCategoryById,
  };
}
