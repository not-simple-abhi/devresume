import type { TestingLibraryMatchers } from '@types/testing-library__jest-dom/matchers'

declare module 'vitest' {
  interface Assertion<T = unknown> extends TestingLibraryMatchers<T, void> {}
  interface AsymmetricMatchersContaining extends TestingLibraryMatchers<unknown, void> {}
}
