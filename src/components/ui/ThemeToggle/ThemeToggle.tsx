'use client'

import React from 'react'
import { useTheme } from '@/context/themeContext'
import Dropdown from '../Dropdown'
import Button from '../Button'
import MenuItem from '../MenuItem'


export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()

  const themes = [
    {
      value: 'light' as const,
      label: 'Light',
      icon: '☀️',
      description: 'Light theme',
    },
    {
      value: 'dark' as const,
      label: 'Dark',
      icon: '🌙',
      description: 'Dark theme',
    },
    {
      value: 'system' as const,
      label: 'System',
      icon: '💻',
      description: 'System preference',
    },
  ]

  const currentTheme = themes.find(t => t.value === theme)

  return (
    <Dropdown
      trigger={
        <Button
          variant="ghost"
          size="sm"
          className="w-9 px-0"
          aria-label="Toggle theme"
        >
          <span className="text-lg">
            {resolvedTheme === 'dark' ? '🌙' : '☀️'}
          </span>
          <span className="sr-only">Toggle theme</span>
        </Button>
      }
    >
      {themes.map((themeOption) => (
        <MenuItem
          key={themeOption.value}
          onClick={() => setTheme(themeOption.value)}
          className={`flex items-center gap-2 ${
            theme === themeOption.value ? 'bg-primary-100 text-primary-900 dark:bg-primary-900 dark:text-primary-100' : ''
          }`}
        >
          <span className="text-lg">{themeOption.icon}</span>
          <div className="flex flex-col">
            <span className="font-medium">{themeOption.label}</span>
            <span className="text-xs text-muted-foreground">
              {themeOption.description}
            </span>
          </div>
          {theme === themeOption.value && (
            <span className="ml-auto text-primary-600 dark:text-primary-400">
              ✓
            </span>
          )}
        </MenuItem>
      ))}
    </Dropdown>
  )
}
