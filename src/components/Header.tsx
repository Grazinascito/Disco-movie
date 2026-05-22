/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useMovie } from '../context/MovieContext';
import { 
  Hash, 
  Search, 
  Sun, 
  Moon, 
  Menu, 
  Flame, 
  Star, 
  Compass, 
  Sparkles,
  Tv,
  X
} from 'lucide-react';

export default function Header() {
  const { 
    filter, 
    searchQuery, 
    setSearchQuery, 
    theme, 
    toggleTheme, 
    sidebarCollapsed, 
    setSidebarCollapsed,
    filteredMovies
  } = useMovie();

  // Determine active title symbol and text
  const renderActiveTitle = () => {
    switch (filter.type) {
      case 'trending':
        return (
          <>
            <Flame className="w-5 h-5 text-orange-500 shrink-0" />
            <span className="font-bold text-zinc-800 dark:text-white text-sm">trending-now</span>
          </>
        );
      case 'favorites':
        return (
          <>
            <Star className="w-5 h-5 text-[#f0b232] fill-current shrink-0" />
            <span className="font-bold text-zinc-800 dark:text-white text-sm">my-favorites</span>
          </>
        );
      case 'genre':
        return (
          <>
            <Hash className="w-5 h-5 text-zinc-400 dark:text-zinc-500 shrink-0" />
            <span className="font-bold text-zinc-800 dark:text-white text-sm">{filter.genreName.toLowerCase()}</span>
          </>
        );
      case 'all':
      default:
        return (
          <>
            <Hash className="w-5 h-5 text-zinc-400 dark:text-zinc-500 shrink-0" />
            <span className="font-bold text-zinc-800 dark:text-white text-sm">all-movies</span>
          </>
        );
    }
  };

  return (
    <header 
      id="main-header"
      className="h-14 px-4 bg-white dark:bg-[#313338] border-b border-[#e3e5e8] dark:border-zinc-950/20 shadow-sm flex items-center justify-between shrink-0 select-none z-30 font-sans"
    >
      {/* Left section: Collapse Trigger & Room Location Title */}
      <div className="flex items-center gap-2 overflow-hidden">
        {sidebarCollapsed && (
          <button
            id="sidebar-open-btn"
            onClick={() => setSidebarCollapsed(false)}
            className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 rounded cursor-pointer transition-colors"
            title="Expand channels list"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        
        <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 font-medium">
          {renderActiveTitle()}
        </div>

        {/* Short divider */}
        <div className="hidden md:block w-[1px] h-4 bg-zinc-300 dark:bg-zinc-800 mx-1.5" />

        {/* Short status summary */}
        <div className="hidden lg:flex items-center gap-1 text-[11px] text-zinc-500 dark:text-zinc-400">
          <Tv className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400/80" />
          <span>Showing {filteredMovies.length} matching titles</span>
        </div>
      </div>

      {/* Right section: Reactive Search & Theme Switch */}
      <div className="flex items-center gap-3">
        {/* Discord-like Search Box */}
        <div className="relative flex items-center">
          <input
            id="header-movie-search"
            type="text"
            placeholder="Search movie, actors, genres..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-40 sm:w-60 h-7 px-2 pr-7 text-xs bg-zinc-100 dark:bg-[#1e1f22] text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-500 rounded border-none focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
          />
          {searchQuery ? (
            <button
              id="clear-search-btn"
              onClick={() => setSearchQuery('')}
              className="absolute right-2 text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 cursor-pointer"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <Search className="absolute right-2 w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
          )}
        </div>

        {/* Clean Theme Toggle Button */}
        <button
          id="theme-toggle-btn"
          onClick={toggleTheme}
          className="p-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 rounded cursor-pointer transition duration-150"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-[#f0b232]" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-600" />
          )}
        </button>
      </div>
    </header>
  );
}
