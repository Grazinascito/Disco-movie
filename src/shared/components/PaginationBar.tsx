/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface PaginationBarProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  startIndex: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

/**
 * Calcula quais números de página e ellipsis ("...") exibir na barra.
 *
 * Estratégia: sempre mostra a primeira, a última, a página atual e
 * até 1 vizinho de cada lado da atual. Insere 'ellipsis' nos buracos.
 *
 * Exemplos:
 *   totalPages=10, currentPage=1  → [1, 2, 'ellipsis', 10]
 *   totalPages=10, currentPage=5  → [1, 'ellipsis', 4, 5, 6, 'ellipsis', 10]
 *   totalPages=10, currentPage=10 → [1, 'ellipsis', 9, 10]
 */
function getPageRange(currentPage: number, totalPages: number): (number | 'ellipsis')[] {
  if (totalPages <= 7) {
    // Com 7 ou menos páginas, mostra todas sem ellipsis.
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // Conjunto de páginas que sempre aparecem: primeira, última e vizinhos da atual.
  const visible = new Set<number>();
  visible.add(1);
  visible.add(totalPages);
  for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages, currentPage + 1); i++) {
    visible.add(i);
  }

  // Converte o Set ordenado para o array final, inserindo 'ellipsis' nos saltos.
  const sorted = Array.from(visible).sort((a, b) => a - b);
  const result: (number | 'ellipsis')[] = [];

  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
      result.push('ellipsis');
    }
    result.push(sorted[i]);
  }

  return result;
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
