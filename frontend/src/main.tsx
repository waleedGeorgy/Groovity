import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import './index.css'
import App from './App.tsx'
import AuthProvider from './providers/AuthProvider.tsx'
import { shadcn } from '@clerk/themes'

const PUBLISHABLE_KEY: string = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

createRoot(document.getElementById('root')!).render(
  <>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} appearance={{ theme: [shadcn] }}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ClerkProvider>
  </>,
)
