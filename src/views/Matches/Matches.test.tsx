import { render, screen, within } from '@testing-library/react'
import { server } from '@/lib/msw/node'
import { Matches } from './Matches'
import { ReactNode } from 'react'
import { ApiConfigProvider } from '@/lib/api'
import userEvent from '@testing-library/user-event'

beforeAll(() => {
  server.listen()
})
afterEach(() => {
  server.resetHandlers()
})
afterAll(() => {
  server.close()
})

const Wrapper = (props: { children: ReactNode }) => (
  <ApiConfigProvider
    baseURL="/api"
    defaultHeaders={
      new Headers({
        authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDkyOTA0NzIsImV4cCI6NDg2Mjg5MDQ3MiwianRpIjoiYzFjMGVjNTMtMzc1Ny00Y2FjLTk5YTMtZjk3NDAwMTA5ZTFkIiwic3ViIjoiYzBlZDM2YzAtNmM1OS00OGQ0LWExNjgtYjYwNzZjZWM1MmEwIiwidHlwZSI6ImFjY2VzcyJ9.InRoaXMtaXMtbm90LWEtcmVhbC1zaWduYXR1cmUi',
      })
    }>
    {props.children}
  </ApiConfigProvider>
)

test('renders a table with some known values', async () => {
  render(<Matches />, { wrapper: Wrapper })

  const table = await screen.findByRole('table', { name: 'Matches' })
  const rows = within(table).getAllByRole('row')

  expect(rows).toHaveLength(1 + 10) // header + 10 rows

  const headerRow = rows[0]
  const headers = within(headerRow).getAllByRole('columnheader')

  expect(headers).toHaveLength(5)
  expect(headers.map(header => header.innerHTML)).toEqual(['Sport', 'Date', 'Start', 'End', 'Players'])
})

test('renders a logout button and propagates its click via props', async () => {
  const onLogoutRequest = vi.fn()
  render(<Matches onLogoutRequest={onLogoutRequest} />, { wrapper: Wrapper })

  const logoutButton = screen.getByRole('button', { name: 'Logout' })
  await userEvent.click(logoutButton)

  expect(onLogoutRequest).toHaveBeenCalledOnce()
})
