/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { act, renderHook } from '@testing-library/react';
import { usePagination } from './usePagination';

describe('usePagination', () => {
  const items = Array.from({ length: 20 }, (_, i) => `item-${i + 1}`);

  it('returns the first page slice with 8 items per page', () => {
    const { result } = renderHook(() => usePagination(items));

    expect(result.current.currentPage).toBe(1);
    expect(result.current.totalPages).toBe(3);
    expect(result.current.paginatedItems).toHaveLength(8);
    expect(result.current.paginatedItems[0]).toBe('item-1');
    expect(result.current.paginatedItems[7]).toBe('item-8');
    expect(result.current.startIndex).toBe(0);
    expect(result.current.itemsPerPage).toBe(8);
  });

  it('navigates to a valid page with goToPage', () => {
    const { result } = renderHook(() => usePagination(items));

    act(() => {
      result.current.goToPage(2);
    });

    expect(result.current.currentPage).toBe(2);
    expect(result.current.paginatedItems[0]).toBe('item-9');
    expect(result.current.startIndex).toBe(8);
  });

  it('clamps goToPage below 1 and above totalPages', () => {
    const { result } = renderHook(() => usePagination(items));

    act(() => {
      result.current.goToPage(0);
    });
    expect(result.current.currentPage).toBe(1);

    act(() => {
      result.current.goToPage(99);
    });
    expect(result.current.currentPage).toBe(3);
  });

  it('resets to page 1 when items change', () => {
    const { result, rerender } = renderHook(({ list }) => usePagination(list), {
      initialProps: { list: items },
    });

    act(() => {
      result.current.goToPage(2);
    });
    expect(result.current.currentPage).toBe(2);

    rerender({ list: Array.from({ length: 15 }, (_, i) => `new-${i}`) });

    expect(result.current.currentPage).toBe(1);
    expect(result.current.totalPages).toBe(2);
  });

  it('moves current page within bounds when items shrink', () => {
    const { result, rerender } = renderHook(({ list }) => usePagination(list), {
      initialProps: { list: items },
    });

    act(() => {
      result.current.goToPage(3);
    });

    rerender({ list: items.slice(0, 4) });

    expect(result.current.currentPage).toBe(1);
    expect(result.current.totalPages).toBe(1);
    expect(result.current.paginatedItems).toHaveLength(4);
  });

  it('handles empty items with totalPages of 1', () => {
    const { result } = renderHook(() => usePagination([]));

    expect(result.current.totalPages).toBe(1);
    expect(result.current.paginatedItems).toEqual([]);
  });
});
