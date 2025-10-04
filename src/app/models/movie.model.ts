import { Genre } from './genre.model';

export interface Movie {
  adult: boolean;
  backdrop_path: string;
  id: number;
  imdb_id: string;
  original_title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  runtime: number;
  genres: Genre[];
  title: string;
  vote_average: number;
}
