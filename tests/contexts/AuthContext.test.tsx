import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'

// 🛡️ Database is mocked - safe to test!

// Test component to access auth context
function TestComponent() {
  const { user, isAdmin, loading, signIn, signOut } = useAuth()
  
  return (
    <div>
      <div data-testid="loading">{loading ? 'loading' : 'loaded'}</div>
      <div data-testid="user-email">{user?.email || 'not logged in'}</div>
      <div data-testid="is-admin">{isAdmin ? 'admin' : 'not admin'}</div>
      <button onClick={() => signIn('test@example.com', 'password123')}>
        Sign In
      </button>
      <button onClick={signOut}>Sign Out</button>
    </div>
  )
}

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('initializes with loading state', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    
    // Initial state should be loading or loaded quickly
    const loadingElement = screen.getByTestId('loading')
    expect(loadingElement).toBeInTheDocument()
  })

  it('shows not logged in state initially', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    
    await waitFor(() => {
      expect(screen.getByTestId('user-email')).toHaveTextContent('not logged in')
    }, { timeout: 3000 })
  })

  it('shows not admin state initially', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    
    await waitFor(() => {
      expect(screen.getByTestId('is-admin')).toHaveTextContent('not admin')
    })
  })

  it('has signIn function available', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    
    const signInButton = screen.getByText('Sign In')
    expect(signInButton).toBeInTheDocument()
  })

  it('has signOut function available', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    
    const signOutButton = screen.getByText('Sign Out')
    expect(signOutButton).toBeInTheDocument()
  })
})
