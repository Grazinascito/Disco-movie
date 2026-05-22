/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MovieProvider, useMovie } from './context/MovieContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MovieGrid from './components/MovieGrid';
import MovieModal from './components/MovieModal';
import { AnimatePresence } from 'motion/react';

function AppContent() {
  const { selectedMovieId } = useMovie();

  return (
    <div id="discord-app-root" className="h-screen w-screen flex overflow-hidden font-sans bg-white dark:bg-[#313338] text-zinc-800 dark:text-zinc-200 antialiased">
      {/* Discord Left collapsible Navigation Sidebar */}
      <Sidebar />

      {/* Main Stream Column: Chat & Grid layout */}
      <div id="discord-main-viewport" className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        {/* Discord Header section */}
        <Header />

        {/* Discord Main content scroll box */}
        <main className="flex-1 flex flex-col min-h-0 relative min-w-0">
          <MovieGrid />
        </main>
      </div>

      {/* Detailed Modal System Carousel Overlay */}
      <AnimatePresence>
        {selectedMovieId && <MovieModal />}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <MovieProvider>
      <AppContent />
    </MovieProvider>
  );
}
