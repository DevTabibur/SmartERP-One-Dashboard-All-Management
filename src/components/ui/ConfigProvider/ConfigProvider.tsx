import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

export interface ThemeConfig {
  mode: 'light' | 'dark' | 'system';
  contrast: 'default' | 'high';
  direction: 'ltr' | 'rtl';
  compact: boolean;
  fullScreen: boolean;
}

export interface ColorConfig {
  primary: string;
  secondary: string;
  accent: string;
  neutral: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface FontConfig {
  family: 'DM Sans' | 'Nunito Sans' | 'Roboto' | 'Public Sans' | 'Inter';
  size: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
  weight: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
}

export interface LayoutConfig {
  sidebar: 'collapsed' | 'expanded' | 'hidden';
  header: 'fixed' | 'sticky' | 'static';
  footer: 'fixed' | 'sticky' | 'static';
  content: 'centered' | 'full-width' | 'constrained';
}

export interface ConfigProviderProps {
  children: ReactNode;
  defaultTheme?: Partial<ThemeConfig>;
  defaultColors?: Partial<ColorConfig>;
  defaultFonts?: Partial<FontConfig>;
  defaultLayout?: Partial<LayoutConfig>;
  onConfigChange?: (config: AppConfig) => void;
}

export interface AppConfig {
  theme: ThemeConfig;
  colors: ColorConfig;
  fonts: FontConfig;
  layout: LayoutConfig;
}

const defaultTheme: ThemeConfig = {
  mode: 'system',
  contrast: 'default',
  direction: 'ltr',
  compact: false,
  fullScreen: false,
};

const defaultColors: ColorConfig = {
  primary: '#3B82F6',
  secondary: '#6B7280',
  accent: '#8B5CF6',
  neutral: '#9CA3AF',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#06B6D4',
};

const defaultFonts: FontConfig = {
  family: 'Inter',
  size: 'base',
  weight: 'normal',
};

const defaultLayout: LayoutConfig = {
  sidebar: 'expanded',
  header: 'sticky',
  footer: 'static',
  content: 'constrained',
};

const ConfigContext = createContext<{
  config: AppConfig;
  updateTheme: (theme: Partial<ThemeConfig>) => void;
  updateColors: (colors: Partial<ColorConfig>) => void;
  updateFonts: (fonts: Partial<FontConfig>) => void;
  updateLayout: (layout: Partial<LayoutConfig>) => void;
  resetConfig: () => void;
} | null>(null);

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};

const ConfigProvider: React.FC<ConfigProviderProps> = ({
  children,
  defaultTheme: userDefaultTheme = {},
  defaultColors: userDefaultColors = {},
  defaultFonts: userDefaultFonts = {},
  defaultLayout: userDefaultLayout = {},
  onConfigChange,
}) => {
  const [config, setConfig] = useState<AppConfig>({
    theme: { ...defaultTheme, ...userDefaultTheme },
    colors: { ...defaultColors, ...userDefaultColors },
    fonts: { ...defaultFonts, ...userDefaultFonts },
    layout: { ...defaultLayout, ...userDefaultLayout },
  });

  // Apply theme mode to document
  useEffect(() => {
    const root = document.documentElement;
    const { mode, contrast, direction, compact } = config.theme;

    // Apply theme mode
    if (mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Apply contrast
    root.setAttribute('data-contrast', contrast);

    // Apply direction
    root.setAttribute('dir', direction);

    // Apply compact mode
    if (compact) {
      root.classList.add('compact');
    } else {
      root.classList.remove('compact');
    }
  }, [config.theme]);

  // Apply custom CSS variables for colors
  useEffect(() => {
    const root = document.documentElement;
    Object.entries(config.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
  }, [config.colors]);

  // Apply font family
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--font-family', config.fonts.family);
  }, [config.fonts.family]);

  const updateTheme = (theme: Partial<ThemeConfig>) => {
    setConfig(prev => {
      const newConfig = {
        ...prev,
        theme: { ...prev.theme, ...theme }
      };
      onConfigChange?.(newConfig);
      return newConfig;
    });
  };

  const updateColors = (colors: Partial<ColorConfig>) => {
    setConfig(prev => {
      const newConfig = {
        ...prev,
        colors: { ...prev.colors, ...colors }
      };
      onConfigChange?.(newConfig);
      return newConfig;
    });
  };

  const updateFonts = (fonts: Partial<FontConfig>) => {
    setConfig(prev => {
      const newConfig = {
        ...prev,
        fonts: { ...prev.fonts, ...fonts }
      };
      onConfigChange?.(newConfig);
      return newConfig;
    });
  };

  const updateLayout = (layout: Partial<LayoutConfig>) => {
    setConfig(prev => {
      const newConfig = {
        ...prev,
        layout: { ...prev.layout, ...layout }
      };
      onConfigChange?.(newConfig);
      return newConfig;
    });
  };

  const resetConfig = () => {
    const newConfig = {
      theme: { ...defaultTheme, ...userDefaultTheme },
      colors: { ...defaultColors, ...userDefaultColors },
      fonts: { ...defaultFonts, ...userDefaultFonts },
      layout: { ...defaultLayout, ...userDefaultLayout },
    };
    setConfig(newConfig);
    onConfigChange?.(newConfig);
  };

  return (
    <ConfigContext.Provider
      value={{
        config,
        updateTheme,
        updateColors,
        updateFonts,
        updateLayout,
        resetConfig,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};

export default ConfigProvider;
