import { IndexMovie } from './index-movie.model';

export interface MoviesResponse {
  page: number;
  results: IndexMovie[];
  total_pages: number;
  total_results: number;
}
