/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Movie {
  id: string;
  title: string;
  year: number;
  genres: string[];
  rating: number; // Out of 10
  duration: string; // e.g., "2h 10m"
  director: string;
  cast: string[];
  synopsis: string;
  posterUrl: string;
  backdropUrl: string;
  tagline: string;
  isTrending?: boolean;
}

export type SidebarFilter = 
  | { type: 'all' }
  | { type: 'trending' }
  | { type: 'favorites' }
  | { type: 'genre'; genreName: string };

export interface UserProfile {
  username: string;
  discriminator: string;
  avatarUrl: string;
  status: 'online' | 'idle' | 'dnd' | 'offline';
  statusText?: string;
}
