/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../test/renderWithProviders';
import { useMovie } from './MovieContext';
import { MOVIES_DATA } from '../data/movies';

function MovieContextProbe() {
  const {
    filteredMovies,
    favorites,
    toggleFavorite,
    setFilter,
    setSearchQuery,
    setSelectedMovieId,
    goToNextMovie,
    goToPreviousMovie,
    selectedMovieId,
  } = useMovie();

  const trendingCount = filteredMovies.filter((m) => m.isTrending).length;

  return (
    <div>
      <span data-testid="filtered-count">{filteredMovies.length}</span>
      <span data-testid="trending-count">{trendingCount}</span>
      <span data-testid="favorites-count">{favorites.length}</span>
      <span data-testid="selected-id">{selectedMovieId ?? 'none'}</span>
      <button type="button" onClick={() => toggleFavorite(MOVIES_DATA[0].id)}>
        toggle-favorite
      </button>
      <button type="button" onClick={() => setFilter({ type: 'trending' })}>
        filter-trending
      </button>
      <button type="button" onClick={() => setSearchQuery('nolan')}>
        search-nolan
      </button>
      <button type="button" onClick={() => setSelectedMovieId(filteredMovies[0]?.id ?? null)}>
        select-first
      </button>
      <button type="button" onClick={goToNextMovie}>
        next-movie
      </button>
      <button type="button" onClick={goToPreviousMovie}>
        prev-movie
      </button>
    </div>
  );
}

describe('MovieContext', () => {
  it('persists favorites in localStorage when toggled', async () => {
    const { user } = renderWithProviders(<MovieContextProbe />);

    await user.click(screen.getByRole('button', { name: 'toggle-favorite' }));

    expect(screen.getByTestId('favorites-count')).toHaveTextContent('1');
    expect(JSON.parse(localStorage.getItem('discord-movie-favorites')!)).toEqual([
      MOVIES_DATA[0].id,
    ]);
  });

  it('filters movies by sidebar filter and search query', async () => {
    const { user } = renderWithProviders(<MovieContextProbe />);

    expect(screen.getByTestId('filtered-count')).toHaveTextContent(String(MOVIES_DATA.length));

    await user.click(screen.getByRole('button', { name: 'filter-trending' }));
    const trendingMovies = MOVIES_DATA.filter((m) => m.isTrending);
    expect(screen.getByTestId('filtered-count')).toHaveTextContent(String(trendingMovies.length));

    await user.click(screen.getByRole('button', { name: 'search-nolan' }));
    expect(Number(screen.getByTestId('filtered-count').textContent)).toBeLessThan(
      trendingMovies.length
    );
  });

  it('navigates to next and previous movie in filtered list', async () => {
    const { user } = renderWithProviders(<MovieContextProbe />);

    await user.click(screen.getByRole('button', { name: 'filter-trending' }));
    await user.click(screen.getByRole('button', { name: 'select-first' }));

    const firstId = screen.getByTestId('selected-id').textContent;
    expect(firstId).not.toBe('none');

    await user.click(screen.getByRole('button', { name: 'next-movie' }));
    const secondId = screen.getByTestId('selected-id').textContent;
    expect(secondId).not.toBe(firstId);

    await user.click(screen.getByRole('button', { name: 'prev-movie' }));
    expect(screen.getByTestId('selected-id')).toHaveTextContent(firstId!);
  });
});
