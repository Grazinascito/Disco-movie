/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useMovie } from '../context/MovieContext';
import { Star, Clock, Play, RefreshCw, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { usePagination } from '../shared/hooks/usePagination';
import PaginationBar from '../shared/components/PaginationBar';

export default function MovieGrid() {
  const { 
    filteredMovies, 
    favorites, 
    toggleFavorite, 
    setSelectedMovieId,
    setFilter,
    setSearchQuery
  } = useMovie();

  const { currentPage, totalPages, paginatedItems, startIndex, itemsPerPage, goToPage } =
    usePagination(filteredMovies);

  const isFavorite = (id: string) => favorites.includes(id);

  const handleResetFilters = () => {
    setFilter({ type: 'all' });
    setSearchQuery('');
  };

  // Render Discord-style empty state screen if no results are found
  if (filteredMovies.length === 0) {
    return (
      <div 
        id="empty-results-fallback"
        className="flex-1 flex flex-col items-center justify-center p-6 text-center select-none font-sans"
      >
        <div className="w-20 h-20 bg-zinc-100 dark:bg-[#2b2d31] rounded-full flex items-center justify-center shadow-md mb-4 text-zinc-400 dark:text-zinc-500 ring-4 ring-zinc-200/50 dark:ring-[#232428]/30">
          <AlertCircle className="w-10 h-10" />
        </div>
        <h3 className="text-xl font-bold text-zinc-800 dark:text-zinc-200">
          No matches found on this server
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 max-w-md">
          We couldn't find any movies matching your search or active filters. Try checking spelling, selecting another category, or resetting filters.
        </p>
        <button
          id="reset-search-btn"
          onClick={handleResetFilters}
          className="mt-6 flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-500 hover:bg-indigo-600 rounded transition cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reset Search & Genres
        </button>
      </div>
    );
  }

  return (
    <div id="movie-grid-viewport" className="flex-1 flex flex-col overflow-y-auto p-4 md:p-6 select-none font-sans bg-zinc-50 dark:bg-[#313338] custom-scrollbar">
      
      {/* SECTION HEADER */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Library Catalogue
        </h2>
        <span className="text-xs text-zinc-400 dark:text-zinc-500">
          Page {currentPage} of {totalPages || 1}
        </span>
      </div>

      {/* CONTENT: THE MOVIE BENTO GRID */}
      <div 
        id="movies-layout-grid"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
      >
        {paginatedItems.map((movie, index) => {
          const starred = isFavorite(movie.id);
          return (
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: Math.min(index * 0.05, 0.4) }}
              id={`movie-card-${movie.id}`}
              onClick={() => setSelectedMovieId(movie.id)}
              className="bg-white dark:bg-[#2b2d31] rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800/40 shadow hover:shadow-lg hover:border-indigo-400/40 dark:hover:border-indigo-500/40 group cursor-pointer flex flex-col relative transition-all duration-200"
            >
              {/* IMAGE HOVER OVERLAY */}
              <div className="relative aspect-[3/4] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                
                {/* Visual shade overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-zinc-950/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                {/* STAR BUTTON - Pinned Top Right */}
                <button
                  id={`favorite-star-btn-${movie.id}`}
                  onClick={(e) => {
                    e.stopPropagation(); // Block opening the modal!
                    toggleFavorite(movie.id);
                  }}
                  className={`absolute top-2.5 right-2.5 p-2 rounded-full cursor-pointer backdrop-blur-md transition-all duration-200 hover:scale-110 z-20 
                    ${starred 
                      ? 'bg-yellow-500/100 text-white shadow-lg shadow-yellow-500/25' 
                      : 'bg-[#18191c]/60 text-zinc-300 hover:text-white border border-white/10'
                    }`}
                  title={starred ? "Remove from Favorites" : "Mark as Favorite"}
                >
                  <Star className={`w-4 h-4 ${starred ? 'fill-current' : ''}`} />
                </button>

                {/* Rating Badge Overlay Bottom-Left */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-0.5 rounded bg-[#18191c]/75 border border-white/10 backdrop-blur-sm shadow z-10 text-[11px] font-bold text-yellow-400">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{movie.rating.toFixed(1)}</span>
                </div>

                {/* Duration Badge overlay Bottom-right */}
                <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded bg-[#18191c]/75 border border-white/10 backdrop-blur-sm text-[10px] text-zinc-300 z-10 font-medium">
                  <Clock className="w-3 h-3 text-zinc-400" />
                  <span>{movie.duration}</span>
                </div>

                {/* Play action hover highlight indicator */}
                <div className="absolute inset-x-0 top-1/2 -ml-6 -mt-6 flex justify-center items-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <div className="w-12 h-12 bg-indigo-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/40">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </div>
              </div>

              {/* CARD SPECIFICATIONS */}
              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500 font-mono">
                      {movie.year}
                    </span>
                    <span className="text-zinc-300 dark:text-zinc-600 font-mono text-[10px]">•</span>
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 truncate max-w-28">
                      {movie.director}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-100 tracking-tight leading-snug hover:text-indigo-500 dark:hover:text-indigo-400 transition mt-1 line-clamp-1">
                    {movie.title}
                  </h3>
                </div>

                {/* Pill Tags (Discord voice badge style) */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {movie.genres.map((g) => (
                    <span
                      key={g}
                      className="text-[10px] font-semibold text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800/80 px-2 py-0.5 rounded border border-zinc-200/50 dark:border-zinc-700/30"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <PaginationBar
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredMovies.length}
          startIndex={startIndex}
          itemsPerPage={itemsPerPage}
          onPageChange={goToPage}
        />
      )}
    </div>
  );
}
