/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface PaginationBarProps {
  currentPage: number;
  totalPages: number;
  startIndex: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export default function PaginationBar({
  currentPage,
  totalPages,
  startIndex,
  itemsPerPage,
  totalItems,
  onPageChange,
}: PaginationBarProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div
      id="pagination-container"
      className="mt-8 pt-5 border-t border-zinc-200 dark:border-zinc-800 px-2 flex flex-col sm:flex-row gap-3 items-center justify-between"
    >
      <div className="text-xs text-zinc-500 dark:text-zinc-400">
        Showing <span className="font-semibold text-zinc-700 dark:text-zinc-300">{startIndex + 1}</span> to{' '}
        <span className="font-semibold text-zinc-700 dark:text-zinc-300">
          {Math.min(startIndex + itemsPerPage, totalItems)}
        </span>{' '}
        of <span className="font-semibold text-zinc-700 dark:text-zinc-300">{totalItems}</span> movies
      </div>

      <div className="flex items-center gap-1.5">
        <button
          id="pagination-prev-btn"
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className={`p-2 rounded text-xs font-semibold flex items-center justify-center border border-zinc-200 dark:border-zinc-800/80 cursor-pointer transition-all
            ${currentPage === 1
              ? 'opacity-40 cursor-not-allowed bg-transparent text-zinc-400'
              : 'bg-white dark:bg-[#2b2d31] hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
            }`}
          title="Previous Page"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span>Back</span>
        </button>

        <div className="hidden sm:flex items-center gap-1">
          {Array.from({ length: totalPages }).map((_, idx) => {
            const pageNum = idx + 1;
            const isActive = pageNum === currentPage;
            return (
              <button
                key={pageNum}
                id={`pagination-page-${pageNum}`}
                onClick={() => onPageChange(pageNum)}
                className={`w-8 h-8 rounded text-xs font-bold ring-offset-background transition-colors cursor-pointer
                  ${isActive
                    ? 'bg-indigo-500 text-white shadow shadow-indigo-500/25'
                    : 'bg-white dark:bg-[#2b2d31] hover:bg-zinc-100 dark:hover:bg-zinc-850 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800/60'
                  }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        <button
          id="pagination-next-btn"
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`p-2 rounded text-xs font-semibold flex items-center justify-center border border-zinc-200 dark:border-zinc-800/80 cursor-pointer transition-all
            ${currentPage === totalPages
              ? 'opacity-40 cursor-not-allowed bg-transparent text-zinc-400'
              : 'bg-white dark:bg-[#2b2d31] hover:bg-zinc-100 dark:hover:bg-zinc-850 text-zinc-700 dark:text-zinc-300'
            }`}
          title="Next Page"
        >
          <span>Next</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
}
