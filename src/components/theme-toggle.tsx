"use client"

import { Moon, Sun } from "lucide-react"

interface ThemeToggleProps {
  isDark: boolean
  onToggle: () => void
}

export default function ThemeToggle({ isDark, onToggle }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="fixed top-6 right-6 z-40 p-3 rounded-full glass hover:bg-accent/10 transition-all duration-300 group"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-accent group-hover:scale-110 transition-transform" />
      ) : (
        <Moon className="w-5 h-5 text-foreground group-hover:scale-110 transition-transform" />
      )}
    </button>
  )
}
