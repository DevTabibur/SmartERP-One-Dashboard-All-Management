'use client'

import React, { useState } from 'react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Alert from '@/components/ui/Alert'
import Progress from '@/components/ui/Progress'
import Tabs from '@/components/ui/Tabs'
import Table from '@/components/ui/Table'
import { useTheme } from '@/context/themeContext'

export default function Home() {
  const { theme, resolvedTheme } = useTheme()

  const tableData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active', role: 'Admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Active', role: 'User' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'Inactive', role: 'User' },
  ]

  // Tabs fix: use state for active tab
  const [activeTab, setActiveTab] = useState('1')

  // Table fix: define columns and data for Table component
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (value: any) => value,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (value: any) => value,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (value: any) => value,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (value: string) => (
        <Badge variant={value === 'Active' ? 'success' : 'warning'}>
          {value}
        </Badge>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (value: any) => value,
    },
  ]

  // Button/Badge variant fix: use only allowed variants
  // Allowed Button variants: "success" | "warning" | "info" | "default" | "secondary" | "outline" | "ghost" | "destructive" | "link" | "gradient"
  // Allowed Badge variants: "success" | "warning" | "info" | "default" | "secondary" | "outline" | "ghost" | "destructive" | "link" | "gradient"

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">SmartERP Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Theme: {theme} ({resolvedTheme})
            </span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Theme Information */}
        <Card className="mb-8 p-6">
          <h2 className="text-xl font-semibold mb-4">Theme System</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-primary-50 dark:bg-primary-950 rounded-lg">
              <h3 className="font-medium text-primary-900 dark:text-primary-100 mb-2">Primary Colors</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-primary-500 rounded"></div>
                  <span className="text-sm text-primary-700 dark:text-primary-300">Primary 500</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-primary-600 rounded"></div>
                  <span className="text-sm text-primary-700 dark:text-primary-300">Primary 600</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-secondary-50 dark:bg-secondary-950 rounded-lg">
              <h3 className="font-medium text-secondary-900 dark:text-secondary-100 mb-2">Secondary Colors</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-secondary-500 rounded"></div>
                  <span className="text-sm text-secondary-700 dark:text-secondary-300">Secondary 500</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-secondary-600 rounded"></div>
                  <span className="text-sm text-secondary-700 dark:text-secondary-300">Secondary 600</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-accent-50 dark:bg-accent-950 rounded-lg">
              <h3 className="font-medium text-accent-900 dark:text-accent-100 mb-2">Accent Colors</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-accent-500 rounded"></div>
                  <span className="text-sm text-accent-700 dark:text-accent-300">Accent 500</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-accent-600 rounded"></div>
                  <span className="text-sm text-accent-700 dark:text-accent-300">Accent 600</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Component Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Buttons and Badges */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Buttons & Badges</h3>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button variant="success">Success</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="info">Info</Badge>
                {/* <Badge variant="destructive">Destructive</Badge> */}
              </div>
            </div>
          </Card>

          {/* Alerts and Progress */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Alerts & Progress</h3>
            <div className="space-y-4">
              <Alert variant="info" title="Info Alert">
                This is an informational alert message.
              </Alert>
              <Alert variant="success" title="Success Alert">
                Operation completed successfully!
              </Alert>
              <div className="space-y-2">
                <span className="text-sm font-medium">Progress Bar</span>
                <Progress value={65} className="w-full" />
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs and Table */}
        <div className="mt-8">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Tabs & Table</h3>
            {/* <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              className="mb-6"
              items={[
                {
                  key: '1',
                  label: 'Overview',
                  children: (
                    <div className="p-4">
                      <p className="text-muted-foreground">
                        This is the overview tab content. The theme system provides consistent styling across all components.
                      </p>
                    </div>
                  ),
                },
                {
                  key: '2',
                  label: 'Users',
                  children: (
                    <div className="p-4">
                      <Table columns={columns} data={tableData} />
                    </div>
                  ),
                },
                {
                  key: '3',
                  label: 'Settings',
                  children: (
                    <div className="p-4">
                      <p className="text-muted-foreground">
                        Settings tab content. All components automatically adapt to the current theme.
                      </p>
                    </div>
                  ),
                },
              ]}
            /> */}
          </Card>
        </div>

        {/* Color Palette */}
        <div className="mt-8">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Color Palette</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'].map((shade) => (
                <div key={shade} className="text-center">
                  <div 
                    className={`w-full h-16 rounded-lg mb-2 bg-primary-${shade} border border-border`}
                  ></div>
                  <span className="text-xs text-muted-foreground">Primary {shade}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
