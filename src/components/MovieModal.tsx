/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from 'react';
import { useMovie } from '../context/MovieContext';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  Clock, 
  Calendar, 
  User, 
  Users, 
  Tag, 
  Play, 
  Info,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function MovieModal() {
  const { 
    selectedMovieId, 
    setSelectedMovieId, 
    filteredMovies, 
    favorites, 
    toggleFavorite,
    goToNextMovie,
    goToPreviousMovie
  } = useMovie();

  const [activeTab, setActiveTab] = useState<'about' | 'cast'>('about');
  const modalRef = useRef<HTMLDivElement>(null);

  // Retrieve current active movie details
  const movie = filteredMovies.find((m) => m.id === selectedMovieId);

  // Keyboard navigation support: Left / Right Arrows and Escape keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedMovieId) return;

      if (e.key === 'ArrowRight') {
        goToNextMovie();
      } else if (e.key === 'ArrowLeft') {
        goToPreviousMovie();
      } else if (e.key === 'Escape') {
        setSelectedMovieId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedMovieId, goToNextMovie, goToPreviousMovie, setSelectedMovieId]);

  // Reset active tab on movie swap
  useEffect(() => {
    setActiveTab('about');
  }, [selectedMovieId]);

  if (!movie) return null;

  const isStarred = favorites.includes(movie.id);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      setSelectedMovieId(null);
    }
  };

  return (
    <div 
      id="global-modal-wrapper"
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md select-none font-sans"
    >
      {/* THE INNER CAROUSEL SLIDE SYSTEM wrapper */}
      <div className="relative w-full max-w-4xl flex items-center justify-between">
        
        {/* CAROUSEL CONTROLLER: PREVIOUS BUTTON (Left Arrow) */}
        <button
          id="modal-carousel-prev"
          onClick={(e) => {
            e.stopPropagation();
            goToPreviousMovie();
          }}
          className="absolute -left-12 lg:-left-16 top-1/2 -translate-y-1/2 hidden md:flex items-center justify-center w-10 py-4 rounded-lg bg-zinc-900/80 text-zinc-300 hover:text-white hover:bg-zinc-805 border border-zinc-700/30 transition-all scale-95 hover:scale-100 cursor-pointer shadow-lg hover:shadow-indigo-500/10"
          title="Previous Movie (Left Arrow)"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* MAIN MODAL CONTAINER (Aesthetic Discord Member Card Layout) */}
        <motion.div
          ref={modalRef}
          id="movie-details-modal-box"
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="w-full bg-white dark:bg-[#1e1f22] text-zinc-800 dark:text-zinc-200 rounded-xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col border border-zinc-300 dark:border-zinc-800/80"
        >
          {/* HEADER IMAGE BANNER */}
          <div className="relative h-48 sm:h-64 md:h-72 w-full overflow-hidden shrink-0">
            <img 
              src={movie.backdropUrl} 
              alt={movie.title} 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover select-none"
            />
            {/* Visual bottom/top shade overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-zinc-950/30" />

            {/* Close Button on top right */}
            <button
              id="modal-close-btn"
              onClick={() => setSelectedMovieId(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black/80 text-zinc-300 hover:text-white cursor-pointer transition z-30"
              title="Close Profile (Esc)"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Play Button Trailer Trigger */}
            <div className="absolute top-4 left-4">
              <span className="text-[10px] sm:text-xs uppercase bg-indigo-500 text-white font-extrabold px-3 py-1.5 rounded-full shadow-lg tracking-wider flex items-center gap-1">
                <Play className="w-3 h-3 fill-current" />
                <span>Now Streaming</span>
              </span>
            </div>

            {/* Tagline text centered on top of dark overlay */}
            <div className="absolute bottom-4 left-6 right-6 z-20">
              <p className="text-yellow-400 font-medium italic text-xs sm:text-sm tracking-wide line-clamp-1">
                "{movie.tagline}"
              </p>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white mt-1 select-text">
                {movie.title}
              </h1>
            </div>
          </div>

          {/* DISCORD PROFILE BODY METADATA */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 custom-scrollbar flex flex-col md:flex-row gap-5">
            
            {/* LEFT PROFILE CARD ASSET COLUMN */}
            <div className="w-full md:w-56 flex flex-col shrink-0 gap-4">
              {/* Overlapping Poster Profile Portrait */}
              <div className="hidden md:block w-full aspect-[3/4] rounded-lg overflow-hidden border-4 border-white dark:border-[#1e1f22] -mt-20 relative z-20 shadow-xl shadow-black/40">
                <img 
                  src={movie.posterUrl} 
                  alt={movie.title} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Action Buttons (Favorites Sync inside Modal) */}
              <div 
                id="modal-fav-toggle-strip"
                className="grid grid-cols-2 md:grid-cols-1 gap-2"
              >
                <button
                  id="modal-favorite-toggle"
                  onClick={() => toggleFavorite(movie.id)}
                  className={`w-full py-2 px-3 rounded text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm
                    ${isStarred 
                      ? 'bg-[#f0b232] text-white hover:bg-yellow-600' 
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                    }`}
                >
                  <Star className={`w-3.5 h-3.5 ${isStarred ? 'fill-current' : ''}`} />
                  <span>{isStarred ? 'Favorited' : 'Bookmark'}</span>
                </button>

                <button
                  onClick={() => alert(`Simulating trailer playback for "${movie.title}"!`)}
                  className="w-full py-2 px-3 rounded text-xs font-bold bg-indigo-500 hover:bg-indigo-600 text-white transition flex items-center justify-center gap-1.5 cursor-pointer shadow"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Watch Trailer</span>
                </button>
              </div>

              {/* Technical key facts card */}
              <div className="bg-zinc-100/60 dark:bg-[#2b2d31] p-3 rounded-lg flex flex-col gap-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 dark:text-zinc-405 font-medium">Rating</span>
                  <span className="font-bold text-yellow-500 flex items-center gap-0.5 select-all">
                    <Star className="w-3.5 h-3.5 fill-current text-yellow-500" />
                    {movie.rating.toFixed(1)} / 10
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 dark:text-zinc-405 font-medium">Runtime</span>
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-0.5">
                    <Clock className="w-3.5 h-3.5" />
                    {movie.duration}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 dark:text-zinc-405 font-medium">Year</span>
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-0.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {movie.year}
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT DETAILED TABS SPECIFICATION PANEL */}
            <div className="flex-1 flex flex-col">
              {/* DISCORD PROFILE TAB BAR HEADER */}
              <div className="h-9 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-4 shrink-0 text-xs text-zinc-500">
                <button
                  id="modal-tab-about"
                  onClick={() => setActiveTab('about')}
                  className={`h-full px-1 border-b-2 font-bold cursor-pointer transition
                    ${activeTab === 'about' 
                      ? 'border-indigo-500 text-indigo-500 dark:text-white' 
                      : 'border-transparent hover:text-zinc-700 dark:hover:text-zinc-300'
                    }`}
                >
                  About Film
                </button>
                <button
                  id="modal-tab-cast"
                  onClick={() => setActiveTab('cast')}
                  className={`h-full px-1 border-b-2 font-bold cursor-pointer transition
                    ${activeTab === 'cast' 
                      ? 'border-indigo-500 text-indigo-500 dark:text-white' 
                      : 'border-transparent hover:text-zinc-700 dark:hover:text-zinc-300'
                    }`}
                >
                  Cast & Production
                </button>
              </div>

              {/* TAB CONTENT GRID wrapper */}
              <div className="py-4 flex-1">
                {activeTab === 'about' ? (
                  <div className="flex flex-col gap-4 text-xs sm:text-sm">
                    {/* Synopsis description block */}
                    <div className="flex flex-col gap-1.5">
                      <h4 className="text-xxs font-extrabold uppercase text-zinc-400 dark:text-zinc-500 tracking-wider">
                        Synopsis
                      </h4>
                      <p className="text-zinc-650 dark:text-zinc-300 leading-relaxed select-text">
                        {movie.synopsis}
                      </p>
                    </div>

                    {/* Creative Director */}
                    <div className="flex flex-col gap-1 mt-1">
                      <h4 className="text-xxs font-extrabold uppercase text-zinc-400 dark:text-zinc-500 tracking-wider">
                        Director
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-full">
                          <User className="w-4 h-4" />
                        </div>
                        <span className="font-semibold text-zinc-700 dark:text-zinc-200 select-all">
                          {movie.director}
                        </span>
                      </div>
                    </div>

                    {/* Film Categories */}
                    <div className="flex flex-col gap-1.5 mt-2">
                      <h4 className="text-xxs font-extrabold uppercase text-zinc-400 dark:text-zinc-500 tracking-wider">
                        Genres
                      </h4>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {movie.genres.map((g) => (
                          <span
                            key={g}
                            className="text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 px-2.5 py-1 rounded-md border border-zinc-200 dark:border-zinc-805"
                          >
                            {g}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 text-xs sm:text-sm">
                    {/* Stars Grid list */}
                    <div className="flex flex-col gap-2">
                      <h4 className="text-xxs font-extrabold uppercase text-zinc-400 dark:text-zinc-500 tracking-wider">
                        Starring Cast ({movie.cast.length})
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1 select-text">
                        {movie.cast.map((actor) => (
                          <div 
                            key={actor}
                            className="p-2 bg-zinc-50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800/80 rounded-md flex items-center gap-2.5"
                          >
                            <div className="w-7 h-7 rounded-full bg-zinc-200 dark:bg-[#313338] text-zinc-600 dark:text-zinc-400 flex items-center justify-center font-bold text-xs select-none">
                              {actor.split(' ').map((n) => n[0]).join('')}
                            </div>
                            <span className="font-medium text-zinc-700 dark:text-zinc-200">
                              {actor}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Production specifications details */}
                    <div className="flex flex-col gap-2 mt-2">
                      <h4 className="text-xxs font-extrabold uppercase text-zinc-400 dark:text-zinc-500 tracking-wider">
                        Production Information
                      </h4>
                      <div className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-300 select-all">
                        <p>🧑‍💼 <strong className="text-zinc-500 dark:text-zinc-450">Studio Director:</strong> {movie.director}</p>
                        <p>📅 <strong className="text-zinc-500 dark:text-zinc-450">Release Year:</strong> {movie.year}</p>
                        <p>🏁 <strong className="text-zinc-500 dark:text-zinc-450">Original Language:</strong> English (Original)</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Bottom mobile carousel control strip / status bar */}
          <div className="h-14 bg-zinc-50 dark:bg-[#111214] border-t border-zinc-200 dark:border-zinc-900 px-4 flex items-center justify-between shrink-0 md:hidden sm:px-6">
            <button
              onClick={goToPreviousMovie}
              className="px-3 py-1.5 bg-zinc-200 dark:bg-zinc-800 rounded text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Prev</span>
            </button>
            <span className="text-xs text-zinc-500">
              Carousel Navigation
            </span>
            <button
              onClick={goToNextMovie}
              className="px-3 py-1.5 bg-zinc-200 dark:bg-zinc-800 rounded text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </motion.div>

        {/* CAROUSEL CONTROLLER: NEXT BUTTON (Right Arrow) */}
        <button
          id="modal-carousel-next"
          onClick={(e) => {
            e.stopPropagation();
            goToNextMovie();
          }}
          className="absolute -right-12 lg:-right-16 top-1/2 -translate-y-1/2 hidden md:flex items-center justify-center w-10 py-4 rounded-lg bg-zinc-900/80 text-zinc-300 hover:text-white hover:bg-zinc-805 border border-zinc-700/30 transition-all scale-95 hover:scale-100 cursor-pointer shadow-lg hover:shadow-indigo-500/10"
          title="Next Movie (Right Arrow)"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

      </div>
    </div>
  );
}
