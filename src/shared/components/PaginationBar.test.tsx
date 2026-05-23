/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '@testing-library/react';
import PaginationBar from './PaginationBar';

describe('PaginationBar', () => {
  it('calls onPageChange when next and previous are clicked', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(
      <PaginationBar
        currentPage={2}
        totalPages={5}
        totalItems={40}
        startIndex={8}
        itemsPerPage={8}
        onPageChange={onPageChange}
      />
    );

    await user.click(document.getElementById('pagination-prev-btn')!);
    expect(onPageChange).toHaveBeenCalledWith(1);

    await user.click(document.getElementById('pagination-next-btn')!);
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('calls onPageChange when a page number is clicked', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(
      <PaginationBar
        currentPage={2}
        totalPages={5}
        totalItems={40}
        startIndex={8}
        itemsPerPage={8}
        onPageChange={onPageChange}
      />
    );

    await user.click(document.getElementById('pagination-page-4')!);
    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it('disables previous on first page and next on last page', () => {
    const onPageChange = vi.fn();

    const { rerender } = render(
      <PaginationBar
        currentPage={1}
        totalPages={5}
        totalItems={40}
        startIndex={0}
        itemsPerPage={8}
        onPageChange={onPageChange}
      />
    );

    expect(document.getElementById('pagination-prev-btn')).toBeDisabled();
    expect(document.getElementById('pagination-next-btn')).not.toBeDisabled();

    rerender(
      <PaginationBar
        currentPage={5}
        totalPages={5}
        totalItems={40}
        startIndex={32}
        itemsPerPage={8}
        onPageChange={onPageChange}
      />
    );

    expect(document.getElementById('pagination-next-btn')).toBeDisabled();
    expect(document.getElementById('pagination-prev-btn')).not.toBeDisabled();
  });

  it('shows the current item range text', () => {
    render(
      <PaginationBar
        currentPage={2}
        totalPages={5}
        totalItems={40}
        startIndex={8}
        itemsPerPage={8}
        onPageChange={vi.fn()}
      />
    );

    expect(screen.getByText(/Showing/i)).toHaveTextContent('Showing 9 to 16 of 40 movies');
  });
});
