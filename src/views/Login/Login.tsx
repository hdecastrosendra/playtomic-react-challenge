import { FormEventHandler, useState } from 'react'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import TextField from '@mui/material/TextField'
import { useAuth } from '@/lib/auth'

export interface LoginProps {
  initialValues?: {
    email?: string
    password?: string
  }
}

export function Login(props: LoginProps) {
  const { initialValues, ...otherProps } = props

  const auth = useAuth()
  const [email, setEmail] = useState(initialValues?.email ?? '')
  const [password, setPassword] = useState(initialValues?.password ?? '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit: FormEventHandler<HTMLFormElement> = (ev) => {
    ev.preventDefault()

    setError(null)
    setIsSubmitting(true)

    auth.login({ email, password })
      .catch(err => {
        setError(
          err instanceof Error
            ? err.message
            : String(err)
        )
      })
      .finally(() => { setIsSubmitting(false) })
  }

  return (
    <div {...otherProps}>
      {error && <Alert
        severity="error"
        onClose={() => { setError(null) }}
      >
        {error}
      </Alert>
      }
      <form
        aria-label="Log in"
        aria-busy={isSubmitting ? true : undefined}
        onSubmit={handleSubmit}>
        <TextField
          size="small"
          disabled={isSubmitting}
          label="Email"
          type="email"
          name="email"
          value={email}
          onChange={ev => { setEmail(ev.target.value) }}
        />
        <TextField
          size="small"
          disabled={isSubmitting}
          label="Password"
          type="password"
          name="password"
          value={password}
          onChange={ev => { setPassword(ev.target.value) }}
        />
        {
          isSubmitting
            ? <CircularProgress size={24} />
            : <Button type="submit">Log in</Button>
        }
      </form>
    </div>
  )
}
