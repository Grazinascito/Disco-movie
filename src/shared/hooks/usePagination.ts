/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';

const ITEMS_PER_PAGE = 8;

/**
 * Encapsula toda a lógica de paginação de uma lista qualquer.
 *
 * Recebe `items` — o array já filtrado que vem do contexto — e devolve
 * a fatia atual, a página corrente e um setter com bounds checking.
 *
 * O reset para página 1 acontece automaticamente via useEffect sempre
 * que `items` mudar (novo filtro, nova busca), eliminando a necessidade
 * de qualquer reset manual nos setters do contexto.
 */
export function usePagination<T>(items: T[]) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / ITEMS_PER_PAGE));

  // Volta para a página 1 toda vez que os itens mudam.
  // Isso dispara quando filter ou searchQuery mudam no contexto,
  // porque filteredMovies produz um novo array de referência.
  useEffect(() => {
    setCurrentPage(1);
  }, [items]);

  // Garante que a página atual nunca fica além do total de páginas.
  // Ex: estava na página 4, filtrou e sobrou só 1 página → vai para 1.
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const paginatedItems = useMemo(
    () => items.slice(startIndex, startIndex + ITEMS_PER_PAGE),
    [items, startIndex]
  );

  // goToPage faz bounds checking: nunca deixa ir abaixo de 1 ou acima de totalPages.
  const goToPage = (page: number) => {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
  };

  return {
    currentPage,
    totalPages,
    paginatedItems,
    startIndex,
    itemsPerPage: ITEMS_PER_PAGE,
    goToPage,
  };
}
