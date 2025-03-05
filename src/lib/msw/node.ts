/**
 * MSW setup for node environments. This file enables us to the `handlers` on node
 * environments; such as the tests.
 *
 * @see https://mswjs.io/docs/integrations/node#setup
 */

import { setupServer } from 'msw/node'
import { handlers } from './handlers'
 
export const server = setupServer(...handlers)
