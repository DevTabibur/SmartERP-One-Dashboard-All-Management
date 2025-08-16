import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

/**
 * Tenant type definition.
 * Extend this interface to add more tenant-specific properties as needed.
 */
export interface Tenant {
  id: string
  name: string
  logoUrl?: string
  primaryColor?: string
  secondaryColor?: string
  accentColor?: string
  [key: string]: any // For extensibility
}

/**
 * TenantContextType defines the shape of the context value.
 */
interface TenantContextType {
  tenant: Tenant | null
  setTenant: (tenant: Tenant) => void
  clearTenant: () => void
  isLoading: boolean
  switchTenant: (tenantId: string) => Promise<void>
}

/**
 * Default context value.
 */
const TenantContext = createContext<TenantContextType | undefined>(undefined)

/**
 * TenantProviderProps for wrapping your app.
 */
interface TenantProviderProps {
  children: ReactNode
  initialTenant?: Tenant | null
  fetchTenantById?: (tenantId: string) => Promise<Tenant>
}

/**
 * TenantProvider component.
 * 
 * - Handles tenant state, loading, and switching.
 * - Allows custom fetch logic for tenant data.
 */
export const TenantProvider = ({
  children,
  initialTenant = null,
  fetchTenantById,
}: TenantProviderProps) => {
  const [tenant, setTenantState] = useState<Tenant | null>(initialTenant)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Optionally, load tenant from localStorage/sessionStorage on mount
  useEffect(() => {
    if (!tenant) {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('current-tenant') : null
      if (stored) {
        try {
          setTenantState(JSON.parse(stored))
        } catch {
          // ignore parse error
        }
      }
    }
  }, [])

  // Persist tenant to localStorage
  useEffect(() => {
    if (tenant) {
      localStorage.setItem('current-tenant', JSON.stringify(tenant))
    } else {
      localStorage.removeItem('current-tenant')
    }
  }, [tenant])

  // Set tenant directly
  const setTenant = (tenant: Tenant) => {
    setTenantState(tenant)
  }

  // Clear tenant (logout, switch org, etc)
  const clearTenant = () => {
    setTenantState(null)
    localStorage.removeItem('current-tenant')
  }

  // Switch tenant by id, using provided fetchTenantById or a default fetcher
  const switchTenant = async (tenantId: string) => {
    setIsLoading(true)
    try {
      let newTenant: Tenant | null = null
      if (fetchTenantById) {
        newTenant = await fetchTenantById(tenantId)
      } else {
        // Default fetch logic (customize as needed)
        const res = await fetch(`/api/tenants/${tenantId}`)
        if (!res.ok) throw new Error('Failed to fetch tenant')
        newTenant = await res.json()
      }
      setTenantState(newTenant)
    } catch (error) {
      // Optionally handle error (toast, etc)
      setTenantState(null)
    } finally {
      setIsLoading(false)
    }
  }

  const value: TenantContextType = {
    tenant,
    setTenant,
    clearTenant,
    isLoading,
    switchTenant,
  }

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  )
}

/**
 * useTenant hook for consuming tenant context.
 */
export function useTenant() {
  const context = useContext(TenantContext)
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider')
  }
  return context
}
