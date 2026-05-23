/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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
export function getPageRange(
  currentPage: number,
  totalPages: number
): (number | 'ellipsis')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const visible = new Set<number>();
  visible.add(1);
  visible.add(totalPages);
  for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages, currentPage + 1); i++) {
    visible.add(i);
  }

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
