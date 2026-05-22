/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Movie, SidebarFilter } from '../types';
import { MOVIES_DATA } from '../data/movies';

interface MovieContextType {
  movies: Movie[];
  filteredMovies: Movie[];
  favorites: string[]; // List of movie IDs
  theme: 'light' | 'dark';
  filter: SidebarFilter;
  searchQuery: string;
  currentPage: number;
  selectedMovieId: string | null;
  sidebarCollapsed: boolean;
  setSearchQuery: (query: string) => void;
  setFilter: (filter: SidebarFilter) => void;
  setCurrentPage: (page: number) => void;
  setSelectedMovieId: (id: string | null) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleFavorite: (movieId: string) => void;
  toggleTheme: () => void;
  goToNextMovie: () => void;
  goToPreviousMovie: () => void;
  itemsPerPage: number;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export function MovieProvider({ children }: { children: ReactNode }) {
  // Load initial theme from localStorage safely
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('discord-movie-theme');
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
      }
      return 'dark'; // Discord design defaults to dark!
    }
    return 'dark';
  });

  // Load favorites from localStorage
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const savedFavs = localStorage.getItem('discord-movie-favorites');
      return savedFavs ? JSON.parse(savedFavs) : [];
    }
    return [];
  });

  const [filter, setFilterState] = useState<SidebarFilter>({ type: 'all' });
  const [searchQuery, setSearchQueryState] = useState<string>('');
  const [currentPage, setCurrentPageState] = useState<number>(1);
  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  const itemsPerPage = 8; // Fits beautifully in a 2x4 or 4x2 grid

  // Reset page when filter or search changes
  const setFilter = (newFilter: SidebarFilter) => {
    setFilterState(newFilter);
    setCurrentPageState(1);
  };

  const setSearchQuery = (query: string) => {
    setSearchQueryState(query);
    setCurrentPageState(1);
  };

  // Synchronize theme to HTML class list for Tailwind v4 compatibility
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
    localStorage.setItem('discord-movie-theme', theme);
  }, [theme]);

  // Sync favorites with localStorage
  useEffect(() => {
    localStorage.setItem('discord-movie-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (movieId: string) => {
    setFavorites((prev) => {
      if (prev.includes(movieId)) {
        return prev.filter((id) => id !== movieId);
      } else {
        return [...prev, movieId];
      }
    });
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Compute filtered movies based on active searches and filters
  const filteredMovies = MOVIES_DATA.filter((movie) => {
    // 1. Sidebar filter check
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

    // 2. Search query check
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

  // Navigate carousel in global modal view
  const goToNextMovie = () => {
    if (filteredMovies.length === 0 || !selectedMovieId) return;
    const currentIndex = filteredMovies.findIndex((m) => m.id === selectedMovieId);
    if (currentIndex === -1) return;
    const nextIndex = (currentIndex + 1) % filteredMovies.length;
    setSelectedMovieId(filteredMovies[nextIndex].id);
  };

  const goToPreviousMovie = () => {
    if (filteredMovies.length === 0 || !selectedMovieId) return;
    const currentIndex = filteredMovies.findIndex((m) => m.id === selectedMovieId);
    if (currentIndex === -1) return;
    const prevIndex = (currentIndex - 1 + filteredMovies.length) % filteredMovies.length;
    setSelectedMovieId(filteredMovies[prevIndex].id);
  };

  return (
    <MovieContext.Provider
      value={{
        movies: MOVIES_DATA,
        filteredMovies,
        favorites,
        theme,
        filter,
        searchQuery,
        currentPage,
        selectedMovieId,
        sidebarCollapsed,
        setSearchQuery,
        setFilter,
        setCurrentPage: setCurrentPageState,
        setSelectedMovieId,
        setSidebarCollapsed,
        toggleFavorite,
        toggleTheme,
        goToNextMovie,
        goToPreviousMovie,
        itemsPerPage,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
}

export function useMovie() {
  const context = useContext(MovieContext);
  if (context === undefined) {
    throw new Error('useMovie must be used within a MovieProvider');
  }
  return context;
}
