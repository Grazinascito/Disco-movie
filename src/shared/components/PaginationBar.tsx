/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { getPageRange } from '../utils/getPageRange';

interface PaginationBarProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  startIndex: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

/**
 * Barra de paginação puramente visual.
 *
 * Não acessa nenhum contexto. Recebe os valores calculados pelo hook
 * usePagination e chama onPageChange quando o usuário interage.
 */
export default function PaginationBar({
  currentPage,
  totalPages,
  totalItems,
  startIndex,
  itemsPerPage,
  onPageChange,
}: PaginationBarProps) {
  const pageRange = getPageRange(currentPage, totalPages);

  return (
    <div
      id="pagination-container"
      className="mt-8 pt-5 border-t border-zinc-200 dark:border-zinc-800 px-2 flex flex-col sm:flex-row gap-3 items-center justify-between"
    >
      {/* Texto "Showing X to Y of Z movies" */}
      <div className="text-xs text-zinc-500 dark:text-zinc-400">
        Showing{' '}
        <span className="font-semibold text-zinc-700 dark:text-zinc-300">{startIndex + 1}</span>{' '}
        to{' '}
        <span className="font-semibold text-zinc-700 dark:text-zinc-300">
          {Math.min(startIndex + itemsPerPage, totalItems)}
        </span>{' '}
        of{' '}
        <span className="font-semibold text-zinc-700 dark:text-zinc-300">{totalItems}</span> movies
      </div>

      <div className="flex items-center gap-1.5">
        {/* Botão "Back" */}
        <button
          id="pagination-prev-btn"
          onClick={() => onPageChange(currentPage - 1)}
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

        {/* Botões de página com ellipsis (visíveis apenas em sm+) */}
        <div className="hidden sm:flex items-center gap-1">
          {pageRange.map((entry, idx) => {
            if (entry === 'ellipsis') {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="w-8 h-8 flex items-center justify-center text-xs text-zinc-400 dark:text-zinc-500 select-none"
                >
                  …
                </span>
              );
            }

            const pageNum = entry;
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

        {/* Botão "Next" */}
        <button
          id="pagination-next-btn"
          onClick={() => onPageChange(currentPage + 1)}
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
