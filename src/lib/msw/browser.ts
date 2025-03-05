/**
 * MSW setup for browser environments. This file enables us to the `handlers` while
 * running the development environment in a browser.
 *
 * @see https://mswjs.io/docs/integrations/browser#setup
 */
import { delay, http } from 'msw'
import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'
 
export const worker = setupWorker(
  http.all('*', () => delay('real')),
  ...handlers
)
