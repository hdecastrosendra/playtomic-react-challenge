import localforage from 'localforage'
import { render, screen } from '@testing-library/react'
import { server } from '@/lib/msw/node'
import userEvent from '@testing-library/user-event'
import App from './App'

beforeAll(() => {
  server.listen()
})
afterEach(() => {
  server.resetHandlers()
})
afterAll(() => {
  server.close()
})

describe('anonymous user', () => {
  test('renders a login form', async () => {
    render(<App />)
    const form = await screen.findByRole('form', { name: 'Log in' })
    expect(form).toBeInTheDocument()
  })
})

describe('authenticated user', () => {
  beforeEach(async () => {
    const storage = localforage.createInstance({ name: 'my-app-auth' })
    await storage.setItem('tokens', {
      access:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDkyOTA0NzIsImV4cCI6NDg2Mjg5MDQ3MiwianRpIjoiYzFjMGVjNTMtMzc1Ny00Y2FjLTk5YTMtZjk3NDAwMTA5ZTFkIiwic3ViIjoiYzBlZDM2YzAtNmM1OS00OGQ0LWExNjgtYjYwNzZjZWM1MmEwIiwidHlwZSI6ImFjY2VzcyJ9.InRoaXMtaXMtbm90LWEtcmVhbC1zaWduYXR1cmUi',
      accessExpiresAt: '2124-01-01T00:00Z',
      refresh:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDkyOTA0NzIsImV4cCI6NDg2Mjg5MDQ3MiwianRpIjoiYzFjMGVjNTMtMzc1Ny00Y2FjLTk5YTMtZjk3NDAwMTA5ZTFkIiwic3ViIjoiYzBlZDM2YzAtNmM1OS00OGQ0LWExNjgtYjYwNzZjZWM1MmEwIiwidHlwZSI6InJlZnJlc2gifQ.a97Pqc9uo3YjPtAfJu1CbYh_CyU2IH-Ew6eaR7yST6g',
      refreshExpiresAt: '2124-01-01T00:00Z',
    })
  })

  test('renders a matches table', async () => {
    render(<App />)
    const matches = await screen.findByRole('table', { name: 'Matches' })
    expect(matches).toBeInTheDocument()
  })

  test('can logout', async () => {
    render(<App />)
    const logoutButton = await screen.findByRole('button', { name: 'Logout' })
    await userEvent.click(logoutButton)

    const form = await screen.findByRole('form', { name: 'Log in' })
    expect(form).toBeInTheDocument()
  })
})
