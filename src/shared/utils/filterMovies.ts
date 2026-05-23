/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Movie, SidebarFilter } from '../../types';

export function filterMovies(
  movies: Movie[],
  filter: SidebarFilter,
  searchQuery: string,
  favorites: string[]
): Movie[] {
  return movies.filter((movie) => {
    if (filter.type === 'trending' && !movie.isTrending) {
      return false;
    }
    if (filter.type === 'favorites' && !favorites.includes(movie.id)) {
      return false;
    }
    if (filter.type === 'genre') {
      const hasGenre = movie.genres.some(
        (g) => g.toLowerCase() === filter.genreName.toLowerCase()
      );
      if (!hasGenre) return false;
    }

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase().trim();
      const matchesTitle = movie.title.toLowerCase().includes(query);
      const matchesDirector = movie.director.toLowerCase().includes(query);
      const matchesCast = movie.cast.some((actor) => actor.toLowerCase().includes(query));
      const matchesGenre = movie.genres.some((genre) => genre.toLowerCase().includes(query));

      if (!matchesTitle && !matchesDirector && !matchesCast && !matchesGenre) {
        return false;
      }
    }

    return true;
  });
}
