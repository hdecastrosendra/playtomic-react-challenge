import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'

async function enableMocking() {
  if (process.env.NODE_ENV !== 'development') {
    return
  }

  const { worker } = await import('./lib/msw/browser')

  return worker.start({
    onUnhandledRequest: 'warn',
    quiet: false,
  })
}

enableMocking().then(
  () => {
    const root = ReactDOM.createRoot(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- yes we know this is unsafe
      document.getElementById('root')!,
    )
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    )
  },
  error => {
    console.error('Error while initializing mock server', error)
  },
)
