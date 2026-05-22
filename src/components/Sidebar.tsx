/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useMovie } from '../context/MovieContext';
import { SidebarFilter } from '../types';
import { ALL_GENRES } from '../data/movies';
import { 
  Hash, 
  Flame, 
  Star, 
  Film, 
  Plus, 
  Compass, 
  ChevronDown, 
  ChevronRight, 
  Mic, 
  Headphones, 
  Settings,
  Menu,
  X
} from 'lucide-react';

export default function Sidebar() {
  const { 
    filter, 
    setFilter, 
    favorites, 
    sidebarCollapsed, 
    setSidebarCollapsed,
    theme
  } = useMovie();

  const [genresExpanded, setGenresExpanded] = useState(true);

  // Checks if a filter is active to style the selected channel state
  const isFilterActive = (type: string, param?: string) => {
    if (filter.type === type) {
      if (type === 'genre' && param) {
        return filter.type === 'genre' && filter.genreName.toLowerCase() === param.toLowerCase();
      }
      return true;
    }
    return false;
  };

  const activeChannelClasses = "bg-zinc-600/30 text-zinc-900 dark:text-white font-medium";
  const inactiveChannelClasses = "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-500/10 hover:text-zinc-800 dark:hover:text-zinc-200";

  return (
    <aside 
      id="sidebar" 
      className={`h-screen flex flex-row shrink-0 transition-all duration-300 z-40 bg-zinc-100 dark:bg-[#2b2d31] border-r border-[#e3e5e8] dark:border-zinc-800/40 relative
        ${sidebarCollapsed ? 'w-0' : 'w-60'}`}
    >
      {/* COLUMN: Channel List & Controls (Collapsible) */}
      <div 
        id="channels-container"
        className={`flex-1 flex flex-col h-full overflow-hidden transition-all duration-300
          ${sidebarCollapsed ? 'opacity-0 w-0 pointer-events-none' : 'opacity-100 w-60'}`}
      >
        {/* Channels Header */}
        <div 
          id="channels-header"
          className="h-14 px-4 flex items-center justify-between border-b border-[#e3e5e8] dark:border-zinc-800/50 shadow-sm"
        >
          <div className="flex items-center gap-1.5 overflow-hidden">
            <span id="server-channel-name" className="font-extrabold truncate text-zinc-800 dark:text-zinc-100 tracking-wide text-sm font-sans">
              🎬 MOVIE LOUNGE
            </span>
          </div>
          <button 
            id="sidebar-close-btn"
            onClick={() => setSidebarCollapsed(true)}
            className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 rounded cursor-pointer"
            title="Collapse channels"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Channels list */}
        <div id="channels-list" className="flex-1 overflow-y-auto px-2 py-3 custom-scrollbar flex flex-col gap-4">
          
          {/* Section: Main Channels */}
          <div id="section-discover" className="flex flex-col gap-[2px]">
            <span className="text-xxs px-2 font-bold text-zinc-500 dark:text-zinc-500 uppercase tracking-widest font-sans">
              Discover
            </span>

            <button
              id="channel-all"
              onClick={() => setFilter({ type: 'all' })}
              className={`w-full flex items-center gap-1.5 px-2 py-1.5 rounded text-xs transition duration-150 text-left ${
                isFilterActive('all') ? activeChannelClasses : inactiveChannelClasses
              }`}
            >
              <Hash className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
              <span className="truncate">all-movies</span>
            </button>

            <button
              id="channel-trending"
              onClick={() => setFilter({ type: 'trending' })}
              className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-xs transition duration-150 text-left ${
                isFilterActive('trending') ? activeChannelClasses : inactiveChannelClasses
              }`}
            >
              <div className="flex items-center gap-1.5 truncate">
                <Flame className="w-4 h-4 text-orange-500 shrink-0" />
                <span className="truncate">trending-now</span>
              </div>
              <span className="text-[10px] uppercase font-bold text-emerald-500 dark:text-emerald-400 px-1 bg-emerald-500/10 rounded tracking-wider">
                Hot
              </span>
            </button>

            <button
              id="channel-favorites"
              onClick={() => setFilter({ type: 'favorites' })}
              className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-xs transition duration-150 text-left ${
                isFilterActive('favorites') ? activeChannelClasses : inactiveChannelClasses
              }`}
            >
              <div className="flex items-center gap-1.5 truncate">
                <Star className={`w-4 h-4 ${favorites.length > 0 ? 'text-[#f0b232] fill-current' : 'text-zinc-400'} shrink-0`} />
                <span className="truncate">my-favorites</span>
              </div>
              {favorites.length > 0 && (
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-indigo-500 text-white min-w-4 text-center">
                  {favorites.length}
                </span>
              )}
            </button>
          </div>

          {/* Section: Genre Channels Grid */}
          <div id="section-genres" className="flex flex-col gap-[2px]">
            <button
              id="category-genres-btn"
              onClick={() => setGenresExpanded(!genresExpanded)}
              className="w-full flex items-center gap-1 px-1 py-1 text-zinc-500 dark:text-zinc-500 cursor-pointer overflow-hidden text-left"
            >
              {genresExpanded ? <ChevronDown className="w-3.5 h-3.5 shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 shrink-0" />}
              <span className="text-xxs font-bold uppercase tracking-widest font-sans">
                Genres
              </span>
            </button>

            {genresExpanded && (
              <div className="flex flex-col gap-[2px] mt-1 pl-1 border-l border-zinc-200 dark:border-zinc-800 ml-2">
                {ALL_GENRES.map((g) => {
                  const isActive = isFilterActive('genre', g);
                  return (
                    <button
                      key={g}
                      id={`genre-channel-${g.toLowerCase()}`}
                      onClick={() => setFilter({ type: 'genre', genreName: g })}
                      className={`w-full flex items-center gap-1.5 px-2 py-1 rounded text-xs transition duration-150 text-left ${
                        isActive ? activeChannelClasses : inactiveChannelClasses
                      }`}
                    >
                      <Hash className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 shrink-0" />
                      <span className="truncate">{g.toLowerCase()}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>


      </div>
    </aside>
  );
}
