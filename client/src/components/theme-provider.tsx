"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

export function useTheme() {
  const [mounted, setMounted] = React.useState(false)
  const { theme, setTheme, systemTheme } = useNextTheme()

  React.useEffect(() => {
    setMounted(true)
    console.log('Theme Provider Mounted:', { theme, systemTheme })
  }, [theme, systemTheme])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    console.log('Toggling theme:', { current: theme, new: newTheme })
    setTheme(newTheme)
  }

  return {
    theme: mounted ? theme : undefined,
    systemTheme: mounted ? systemTheme : undefined,
    toggleTheme,
    mounted
  }
}