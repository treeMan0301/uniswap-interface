import '../assets/fonts.scss'

import { mix, readableColor, transparentize } from 'polished'
import { createContext, ReactNode, useContext, useMemo, useState } from 'react'

import styled, { ThemedProvider } from './styled'
import { Colors, ComputedTheme, Theme } from './theme'

export type { Color, Colors, Theme } from './theme'

export default styled
export * from './dynamic'
export * from './layer'
export * from './styled'
export * as ThemedText from './type'

export const brand = 'hsl(331.3, 100%, 50%)'

const stateColors = {
  active: 'hsl(215, 79%, 51.4%)',
  success: 'hsl(145, 63.4%, 41.8%)',
  warning: 'hsl(43, 89.9%, 53.5%)',
  error: 'hsl(0, 98%, 62.2%)',
}

export const lightTheme: Colors = {
  // surface
  accent: brand,
  container: 'hsl(220, 23%, 97.5%)',
  module: 'hsl(231, 14%, 90%)',
  interactive: 'hsl(229, 13%, 83%)',
  outline: 'hsl(225, 7%, 78%)',
  dialog: 'hsl(0, 0%, 100%)',

  // text
  onAccent: 'hsl(0, 0%, 100%)',
  primary: 'hsl(0, 0%, 0%)',
  secondary: 'hsl(227, 10%, 37.5%)',
  hint: 'hsl(224, 9%, 57%)',
  onInteractive: 'hsl(0, 0%, 0%)',

  // state
  ...stateColors,

  currentColor: 'currentColor',
}

const darkThemeAccent = 'hsl(215, 79%, 51.4%)'

export const darkTheme: Colors = {
  // surface
  accent: darkThemeAccent,
  container: 'hsl(220, 10.7%, 11%)',
  module: 'hsl(222, 10.2%, 19.2%)',
  interactive: 'hsl(224, 10.5%, 281%)',
  outline: 'hsl(227, 10%, 37.5%)',
  dialog: 'hsl(0, 0%, 0%)',

  // text
  onAccent: readableColor(darkThemeAccent),
  primary: 'hsl(0, 0%, 100%)',
  secondary: 'hsl(224, 8.7%, 57.1%)',
  hint: 'hsl(225, 10%, 47.1%)',
  onInteractive: 'hsl(0, 0%, 100%)',

  // state
  ...stateColors,

  currentColor: 'currentColor',
}

export const defaultTheme = {
  borderRadius: 1,
  fontFamily: '"Inter", sans-serif',
  fontFamilyVariable: '"InterVariable", sans-serif',
  fontFamilyCode: 'IBM Plex Mono',
  tokenColorExtraction: false,
  ...lightTheme,
}

export function useSystemTheme() {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)')
  const [systemTheme, setSystemTheme] = useState(prefersDark.matches ? darkTheme : lightTheme)
  prefersDark.addEventListener('change', (e) => {
    setSystemTheme(e.matches ? darkTheme : lightTheme)
  })
  return systemTheme
}

const ThemeContext = createContext<ComputedTheme>(toComputedTheme(defaultTheme))

interface ThemeProviderProps {
  theme?: Theme
  children: ReactNode
}

export function ThemeProvider({ theme, children }: ThemeProviderProps) {
  const contextTheme = useContext(ThemeContext)
  const value = useMemo(() => {
    return toComputedTheme({
      ...contextTheme,
      ...theme,
    } as Required<Theme>)
  }, [contextTheme, theme])
  return (
    <ThemeContext.Provider value={value}>
      <ThemedProvider theme={value}>{children}</ThemedProvider>
    </ThemeContext.Provider>
  )
}

function toComputedTheme(theme: Required<Theme>): ComputedTheme {
  return {
    ...theme,
    borderRadius: clamp(
      Number.isFinite(theme.borderRadius) ? (theme.borderRadius as number) : theme.borderRadius ? 1 : 0
    ),
    onHover: (color: string) =>
      color === theme.primary ? transparentize(0.4, theme.primary) : mix(0.16, theme.primary, color),
  }

  function clamp(value: number) {
    return Math.min(Math.max(value, 0), 1)
  }
}
