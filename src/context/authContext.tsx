'use client'

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react'

/**
 * User type definition.
 * Extend this interface to add more user-specific properties as needed.
 */
export interface User {
  id: string
  name: string
  email: string
  avatarUrl?: string
  role?: string
  permissions?: string[]
  [key: string]: any // For extensibility
}

/**
 * AuthContextType defines the shape of the context value.
 */
interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  register: (data: RegisterData) => Promise<void>
  refreshUser: () => Promise<void>
  setUser: (user: User | null) => void
  token: string | null
  setToken: (token: string | null) => void
}

/**
 * Login credentials and registration data types.
 */
export interface LoginCredentials {
  email: string
  password: string
  [key: string]: any
}

export interface RegisterData {
  name: string
  email: string
  password: string
  [key: string]: any
}

/**
 * Default context value.
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * AuthProviderProps for wrapping your app.
 */
interface AuthProviderProps {
  children: ReactNode
  fetchUser?: (token: string) => Promise<User>
  loginRequest?: (credentials: LoginCredentials) => Promise<{ user: User; token: string }>
  logoutRequest?: (token: string) => Promise<void>
  registerRequest?: (data: RegisterData) => Promise<{ user: User; token: string }>
  storageKey?: string
}

/**
 * AuthProvider component.
 * - Handles user authentication state, login, logout, registration, and user refresh.
 * - Allows custom fetch logic for user data and authentication requests.
 */
export const AuthProvider = ({
  children,
  fetchUser,
  loginRequest,
  logoutRequest,
  registerRequest,
  storageKey = 'auth-token',
}: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setTokenState] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(storageKey)
    }
    return null
  })
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Helper to set token in state and localStorage
  const setToken = useCallback((newToken: string | null) => {
    setTokenState(newToken)
    if (typeof window !== 'undefined') {
      if (newToken) {
        localStorage.setItem(storageKey, newToken)
      } else {
        localStorage.removeItem(storageKey)
      }
    }
  }, [storageKey])

  // Fetch user info on mount or when token changes
  const refreshUser = useCallback(async () => {
    if (!token) {
      setUser(null)
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    try {
      let fetchedUser: User | null = null
      if (fetchUser) {
        fetchedUser = await fetchUser(token)
      } else {
        // Default fetch logic (customize as needed)
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error('Failed to fetch user')
        fetchedUser = await res.json()
      }
      setUser(fetchedUser)
    } catch (error) {
      setUser(null)
      setToken(null)
    } finally {
      setIsLoading(false)
    }
  }, [token, fetchUser, setToken])

  useEffect(() => {
    refreshUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  // Login function
  const login = useCallback(
    async (credentials: LoginCredentials) => {
      setIsLoading(true)
      try {
        let result: { user: User; token: string }
        if (loginRequest) {
          result = await loginRequest(credentials)
        } else {
          // Default login logic (customize as needed)
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
          })
          if (!res.ok) throw new Error('Login failed')
          result = await res.json()
        }
        setUser(result.user)
        setToken(result.token)
      } catch (error) {
        setUser(null)
        setToken(null)
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [loginRequest, setToken]
  )

  // Logout function
  const logout = useCallback(async () => {
    setIsLoading(true)
    try {
      if (logoutRequest && token) {
        await logoutRequest(token)
      } else {
        // Default logout logic (customize as needed)
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        })
      }
    } catch (error) {
      // Optionally handle error
    } finally {
      setUser(null)
      setToken(null)
      setIsLoading(false)
    }
  }, [logoutRequest, token, setToken])

  // Register function
  const register = useCallback(
    async (data: RegisterData) => {
      setIsLoading(true)
      try {
        let result: { user: User; token: string }
        if (registerRequest) {
          result = await registerRequest(data)
        } else {
          // Default register logic (customize as needed)
          const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          })
          if (!res.ok) throw new Error('Registration failed')
          result = await res.json()
        }
        setUser(result.user)
        setToken(result.token)
      } catch (error) {
        setUser(null)
        setToken(null)
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [registerRequest, setToken]
  )

  const isAuthenticated = !!user && !!token

  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    register,
    refreshUser,
    setUser,
    token,
    setToken,
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * useAuth hook for consuming the AuthContext.
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// End of file
