/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../test/renderWithProviders';
import { useMovie } from '../context/MovieContext';
import MovieGrid from './MovieGrid';
import { MOVIES_DATA } from '../data/movies';

function MovieGridEmptyHarness() {
  const { setSearchQuery } = useMovie();

  useEffect(() => {
    setSearchQuery('zzzznotfoundquery');
  }, []);

  return <MovieGrid />;
}

describe('MovieGrid', () => {
  it('renders movie cards from the catalogue', () => {
    renderWithProviders(<MovieGrid />);

    expect(screen.getByText('Library Catalogue')).toBeInTheDocument();
    expect(screen.getByText(MOVIES_DATA[0].title)).toBeInTheDocument();
  });

  it('shows pagination when there are more than 8 movies', () => {
    renderWithProviders(<MovieGrid />);

    expect(MOVIES_DATA.length).toBeGreaterThan(8);
    expect(screen.getByText(/Showing/i)).toBeInTheDocument();
    expect(document.getElementById('pagination-container')).toBeInTheDocument();
  });

  it('shows empty state and resets filters on button click', async () => {
    const { user } = renderWithProviders(<MovieGridEmptyHarness />);

    expect(screen.getByText('No matches found on this server')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Reset Search & Genres/i }));

    expect(screen.getByText('Library Catalogue')).toBeInTheDocument();
    expect(screen.queryByText('No matches found on this server')).not.toBeInTheDocument();
  });
});
