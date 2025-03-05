import { afterEach } from 'vitest'
import { configure, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

beforeAll(() => {
  // Setup RTL so error messages don't print the whole DOM on failure
  // see: https://github.com/testing-library/dom-testing-library/issues/773
  configure({
    getElementError(message) { 
        const error = new Error(message ?? '') 
        error.name = 'TestingLibraryElementError' 
        return error
      }
  })
})

// runs a clean after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
})
