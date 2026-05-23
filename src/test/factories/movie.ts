/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Movie } from '../../types';

let movieCounter = 0;

export function createMockMovie(overrides: Partial<Movie> = {}): Movie {
  movieCounter += 1;
  const id = overrides.id ?? `movie-${movieCounter}`;

  return {
    id,
    title: `Movie ${movieCounter}`,
    year: 2020,
    genres: ['Drama'],
    rating: 7.5,
    duration: '2h 0m',
    director: 'Test Director',
    cast: ['Actor One', 'Actor Two'],
    synopsis: 'A test synopsis.',
    posterUrl: 'https://example.com/poster.jpg',
    backdropUrl: 'https://example.com/backdrop.jpg',
    tagline: 'Test tagline',
    isTrending: false,
    ...overrides,
  };
}

export function resetMockMovieCounter() {
  movieCounter = 0;
}
