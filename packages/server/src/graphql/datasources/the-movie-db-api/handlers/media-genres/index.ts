import { RESTDataSource, HTTPCache } from 'apollo-datasource-rest';

import { Iso6391Language, MediaType } from '../../../../../lib/types';
import { getGenres, getFormatedLanguage } from '../../helpers';
import { Genres, MediaGenre } from '../../../../../types';
import env from '../../../../../config/environment';

const GENRE_MOVIE_ENDPOINT = '/genre/movie/list';
const GENRE_TV_SHOW_ENDPOINT = '/genre/tv/list';

export interface Props {
  load: (language?: Iso6391Language | null) => Promise<Genres>;
}

const BASE_URL = 'https://api.themoviedb.org/3';

class MediaGenres extends RESTDataSource {
  constructor() {
    super();
    this.httpCache = new HTTPCache();
    this.baseURL = BASE_URL;
  }

  async getMediaGenres(
    genresIds: number[],
    mediaType: string,
    language?: Iso6391Language | null,
  ): Promise<string[]> {
    const genres = await this.load(mediaType, language);

    return getGenres(genres, genresIds);
  }

  getEndpoint(mediaType: string): string {
    let endpoint = '';

    if (mediaType.toLowerCase() === MediaType.Movie.toLowerCase()) {
      endpoint = GENRE_MOVIE_ENDPOINT;
    }

    if (mediaType.toLowerCase() === MediaType.Tv.toLowerCase()) {
      endpoint = GENRE_TV_SHOW_ENDPOINT;
    }

    return endpoint;
  }

  async load(
    mediaType: string,
    language?: Iso6391Language | null,
  ): Promise<MediaGenre[]> {
    const endpoint = this.getEndpoint(mediaType);

    if (!endpoint) {
      return [];
    }

    const { genres } = await this.get(endpoint, {
      language: getFormatedLanguage(language),
      api_key: env.THE_MOVIE_DB_API_KEY,
    });
    return genres;
  }
}

export default MediaGenres;
