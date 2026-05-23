/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { getPageRange } from './getPageRange';

describe('getPageRange', () => {
  it('returns all pages when totalPages is 7 or less', () => {
    expect(getPageRange(1, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(getPageRange(3, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('returns a single page when totalPages is 1', () => {
    expect(getPageRange(1, 1)).toEqual([1]);
  });

  it('shows first page range with ellipsis before last page', () => {
    expect(getPageRange(1, 10)).toEqual([1, 2, 'ellipsis', 10]);
  });

  it('shows middle page range with ellipsis on both sides', () => {
    expect(getPageRange(5, 10)).toEqual([1, 'ellipsis', 4, 5, 6, 'ellipsis', 10]);
  });

  it('shows last page range with ellipsis after first page', () => {
    expect(getPageRange(10, 10)).toEqual([1, 'ellipsis', 9, 10]);
  });
});
