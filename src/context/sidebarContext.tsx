import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  FC,
  Dispatch,
  SetStateAction,
} from 'react'

/**
 * SidebarItem type definition.
 * Each item can have children for nested menus.
 */
export interface SidebarItem {
  key: string
  label: string
  icon?: React.ReactNode
  path?: string
  children?: SidebarItem[]
  badge?: React.ReactNode | string | number
  section?: string // For grouping
  [key: string]: any // For extensibility
}

/**
 * SidebarContextType defines the shape of the context value.
 */
interface SidebarContextType {
  items: SidebarItem[]
  setItems: Dispatch<SetStateAction<SidebarItem[]>>
  collapsed: boolean
  setCollapsed: Dispatch<SetStateAction<boolean>>
  activeKey: string | null
  setActiveKey: Dispatch<SetStateAction<string | null>>
  openKeys: string[]
  setOpenKeys: Dispatch<SetStateAction<string[]>>
  addItem: (item: SidebarItem, parentKey?: string) => void
  removeItem: (key: string) => void
  updateItem: (key: string, updates: Partial<SidebarItem>) => void
}

/**
 * Default context value.
 */
const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

/**
 * SidebarProviderProps for wrapping your app.
 */
interface SidebarProviderProps {
  children: ReactNode
  initialItems?: SidebarItem[]
  initialCollapsed?: boolean
}

/**
 * SidebarProvider component.
 * - Handles sidebar state, open/collapse, and dynamic item management.
 * - Designed for pro, maintainable, customizable, and reusable sidebar needs.
 */
export const SidebarProvider: FC<SidebarProviderProps> = ({
  children,
  initialItems = [],
  initialCollapsed = false,
}) => {
  const [items, setItems] = useState<SidebarItem[]>(initialItems)
  const [collapsed, setCollapsed] = useState<boolean>(initialCollapsed)
  const [activeKey, setActiveKey] = useState<string | null>(null)
  const [openKeys, setOpenKeys] = useState<string[]>([])

  // Add a sidebar item, optionally as a child of another item
  const addItem = (item: SidebarItem, parentKey?: string) => {
    setItems((prev) => {
      if (!parentKey) return [...prev, item]
      const addToParent = (items: SidebarItem[]): SidebarItem[] =>
        items.map((it) =>
          it.key === parentKey
            ? {
                ...it,
                children: it.children ? [...it.children, item] : [item],
              }
            : it.children
            ? { ...it, children: addToParent(it.children) }
            : it
        )
      return addToParent(prev)
    })
  }

  // Remove a sidebar item by key (recursively)
  const removeItem = (key: string) => {
    const removeRecursive = (items: SidebarItem[]): SidebarItem[] =>
      items
        .filter((it) => it.key !== key)
        .map((it) =>
          it.children
            ? { ...it, children: removeRecursive(it.children) }
            : it
        )
    setItems((prev) => removeRecursive(prev))
  }

  // Update a sidebar item by key (recursively)
  const updateItem = (key: string, updates: Partial<SidebarItem>) => {
    const updateRecursive = (items: SidebarItem[]): SidebarItem[] =>
      items.map((it) =>
        it.key === key
          ? { ...it, ...updates }
          : it.children
          ? { ...it, children: updateRecursive(it.children) }
          : it
      )
    setItems((prev) => updateRecursive(prev))
  }

  const value: SidebarContextType = {
    items,
    setItems,
    collapsed,
    setCollapsed,
    activeKey,
    setActiveKey,
    openKeys,
    setOpenKeys,
    addItem,
    removeItem,
    updateItem,
  }

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  )
}

/**
 * useSidebar hook for consuming sidebar context.
 */
export function useSidebar(): SidebarContextType {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}
