import type Movie from '@@/types/Movie';

export default interface ApiSearchResponse {
  Response: boolean;
  Search: Movie[];
  totalResults: number;
}
