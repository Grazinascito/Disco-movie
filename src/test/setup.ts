/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import React from 'react';
import { afterEach, vi } from 'vitest';

afterEach(() => {
  cleanup();
  localStorage.clear();
});

vi.mock('motion/react', () => {
  const motionProxy = new Proxy(
    {},
    {
      get: (_target, prop: string) => {
        return React.forwardRef(function MotionComponent(
          props: Record<string, unknown>,
          ref: React.Ref<HTMLElement>
        ) {
          const { initial, animate, transition, exit, ...rest } = props;
          return React.createElement(prop, { ...rest, ref });
        });
      },
    }
  );

  return {
    motion: motionProxy,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  };
});
