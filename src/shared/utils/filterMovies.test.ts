/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { filterMovies } from './filterMovies';
import { createMockMovie, resetMockMovieCounter } from '../../test/factories/movie';

describe('filterMovies', () => {
  beforeEach(() => {
    resetMockMovieCounter();
  });

  const movies = [
    createMockMovie({
      id: '1',
      title: 'Interstellar',
      director: 'Christopher Nolan',
      cast: ['Matthew McConaughey'],
      genres: ['Sci-Fi', 'Drama'],
      isTrending: true,
    }),
    createMockMovie({
      id: '2',
      title: 'The Grand Budapest Hotel',
      director: 'Wes Anderson',
      cast: ['Ralph Fiennes'],
      genres: ['Comedy', 'Drama'],
      isTrending: false,
    }),
    createMockMovie({
      id: '3',
      title: 'Inception',
      director: 'Christopher Nolan',
      cast: ['Leonardo DiCaprio'],
      genres: ['Sci-Fi', 'Thriller'],
      isTrending: true,
    }),
  ];

  it('returns all movies with filter type all and empty search', () => {
    expect(filterMovies(movies, { type: 'all' }, '', [])).toHaveLength(3);
  });

  it('filters trending movies only', () => {
    const result = filterMovies(movies, { type: 'trending' }, '', []);
    expect(result.map((m) => m.id)).toEqual(['1', '3']);
  });

  it('filters favorites by movie id', () => {
    const result = filterMovies(movies, { type: 'favorites' }, '', ['2']);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('The Grand Budapest Hotel');
  });

  it('filters by genre case-insensitively', () => {
    const result = filterMovies(movies, { type: 'genre', genreName: 'sci-fi' }, '', []);
    expect(result.map((m) => m.id)).toEqual(['1', '3']);
  });

  it('searches by title', () => {
    const result = filterMovies(movies, { type: 'all' }, 'inception', []);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Inception');
  });

  it('searches by director', () => {
    const result = filterMovies(movies, { type: 'all' }, 'wes anderson', []);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('The Grand Budapest Hotel');
  });

  it('searches by cast member', () => {
    const result = filterMovies(movies, { type: 'all' }, 'ralph fiennes', []);
    expect(result).toHaveLength(1);
  });

  it('searches by genre name', () => {
    const result = filterMovies(movies, { type: 'all' }, 'comedy', []);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('The Grand Budapest Hotel');
  });

  it('combines sidebar filter and search query', () => {
    const result = filterMovies(movies, { type: 'trending' }, 'nolan', []);
    expect(result.map((m) => m.id)).toEqual(['1', '3']);
  });

  it('trims search query whitespace', () => {
    const result = filterMovies(movies, { type: 'all' }, '  inception  ', []);
    expect(result).toHaveLength(1);
  });

  it('returns empty array when nothing matches', () => {
    expect(filterMovies(movies, { type: 'all' }, 'zzzznotfound', [])).toEqual([]);
  });
});
