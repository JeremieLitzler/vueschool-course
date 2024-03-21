import type MovieRating from '@@/types/MovieRating';

export default interface Movie {
  /**
   * These are returned in a search
   */
  Poster: string;
  Title: string;
  Type: string;
  Year: string;
  imdbID: string;
  /**
   * These are returned on a single item fetch
   */
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Ratings: MovieRating[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: string;
}
