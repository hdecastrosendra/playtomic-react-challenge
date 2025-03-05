import { ReactElement, ReactNode } from 'react'
import { HttpResponse, delay, http } from 'msw'
import { vi } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { server } from '@/lib/msw/node'
import { AuthProvider } from '@/lib/auth'
import { Login } from './Login'
import { ApiConfigProvider } from '@/lib/api'


beforeAll(() => { server.listen() })
afterEach(() => { server.resetHandlers() })
afterAll(() => { server.close() })

const Wrapper = (props: { children: ReactNode }): ReactElement => (
  <ApiConfigProvider baseURL="/api">
    <AuthProvider>
      {props.children}
    </AuthProvider>
  </ApiConfigProvider>
)

test('initial values are shown into their inputs', () => {
  const initialEmail = 'alice@playtomic.io'
  const initialPassword = 'MyPassword'
  render(<Login initialValues={{ email: initialEmail, password: initialPassword }} />, { wrapper: Wrapper })

  const form = screen.getByRole('form', { name: 'Log in' })
  const email = within(form).getByRole('textbox', { name: 'Email' })
  const password = within(form).getByLabelText('Password')

  expect(email).toHaveValue(initialEmail)
  expect(password).toHaveValue(initialPassword)
  expect(form).toHaveFormValues({
    email: initialEmail,
    password: initialPassword,
  })
})

test('values can be updated in their inputs', async () => {
  render(<Login />, { wrapper: Wrapper })

  const form = screen.getByRole('form', { name: 'Log in' })
  const email = within(form).getByRole('textbox', { name: 'Email' })
  const password = within(form).getByLabelText('Password')

  expect(email).toHaveValue('')
  expect(password).toHaveValue('')

  await userEvent.type(email, 'alice@playtomic.io')
  await userEvent.type(password, 'MyPassword')

  expect(email).toHaveValue('alice@playtomic.io')
  expect(password).toHaveValue('MyPassword')
  expect(form).toHaveFormValues({
    email: 'alice@playtomic.io',
    password: 'MyPassword',
  })
})

test('sets the form as aria-busy during submit', async () => {  
  server.use(
    // We need to add some delay to the server responses so the form has time to
    // actually go through the submitting state
    http.all('*', () => delay(100)),
  )

  render(<Login initialValues={{ email: 'alice@playtomic.io', password: 'MyPassword' }}/>, { wrapper: Wrapper })

  const form = screen.getByRole('form', { name: 'Log in' })
  const loginButton = within(form).getByRole('button', { name: 'Log in' })

  await userEvent.click(loginButton)

  expect(form).toHaveAttribute('aria-busy', 'true')

  await waitFor(() => {
    expect(form).not.toHaveAttribute('aria-busy')
  })
})

test('passes the form values to the API on submit', async () => {
  const postV3AuthLogin = vi.fn()
  server.use(
    http.post('/api/v3/auth/login', async ({ request }) => {
      postV3AuthLogin(await request.json())
    })
  )

  render(<Login initialValues={{ email: 'alice@playtomic.io', password: 'MyPassword' }} />, { wrapper: Wrapper })

  await userEvent.click(
    screen.getByRole('button', { name: 'Log in' })
  )

  await waitFor(() => { expect(postV3AuthLogin).toHaveBeenCalled() })
  expect(postV3AuthLogin).toHaveBeenCalledWith({
    email: 'alice@playtomic.io',
    password: 'MyPassword',
  })
})

test('shows an alert with any error returned by the API', async () => {
  const loginError = 'Wrong credentials'
  server.use(
    http.post('/api/v3/auth/login', () => {
      return HttpResponse.json(
        { message: loginError },
        { status: 401 },
      )
    }, { once: true })
  )

  render(
    <Login
      initialValues={{ email: 'alice@playtomic.io', password: 'MySuperSecurePassword' }}
    />,
    { wrapper: Wrapper },
  )

  await userEvent.click(
    screen.getByRole('button', { name: 'Log in' })
  )
  
  const alert = await screen.findByRole('alert')
  expect(alert).toHaveTextContent(loginError)
})
