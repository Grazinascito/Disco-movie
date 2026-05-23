/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { ReactElement } from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MovieProvider } from '../context/MovieContext';

interface RenderWithProvidersOptions {
  initialFavorites?: string[];
  initialTheme?: 'light' | 'dark';
}

export function renderWithProviders(
  ui: ReactElement,
  options: RenderWithProvidersOptions = {}
) {
  const { initialFavorites, initialTheme } = options;

  if (initialFavorites) {
    localStorage.setItem('discord-movie-favorites', JSON.stringify(initialFavorites));
  }

  if (initialTheme) {
    localStorage.setItem('discord-movie-theme', initialTheme);
  }

  const user = userEvent.setup();

  const result = render(ui, {
    wrapper: ({ children }) => <MovieProvider>{children}</MovieProvider>,
  });

  return { user, ...result };
}
