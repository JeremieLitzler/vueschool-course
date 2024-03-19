import { RouteName } from '@/enums/RouteName';

export default interface PropsAppPagination {
  pageCount: number;
  pagesAround: number;
  currentPage: number;
  parentRouteName: RouteName;
}
