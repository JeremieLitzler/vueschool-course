import type ApiResponse from '@@/types/ApiResponse';
import type Movie from '@@/types/Movie';

export default interface ApiResponseSearch extends ApiResponse {
  Search?: Movie[];
  totalResults?: number;
}
