"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

interface AccessibilitySettings {
  highContrast: boolean
  reducedMotion: boolean
  fontSize: "small" | "medium" | "large" | "extra-large"
  screenReader: boolean
  keyboardNavigation: boolean
}

interface AccessibilityContextType {
  settings: AccessibilitySettings
  updateSettings: (settings: Partial<AccessibilitySettings>) => void
  announceToScreenReader: (message: string) => void
}

const AccessibilityContext = createContext<AccessibilityContextType | null>(null)

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (!context) {
    throw new Error("useAccessibility must be used within AccessibilityProvider")
  }
  return context
}

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    reducedMotion: false,
    fontSize: "medium",
    screenReader: false,
    keyboardNavigation: true,
  })

  const [announcements, setAnnouncements] = useState<string[]>([])

  useEffect(() => {
    // Load settings from localStorage
    const saved = localStorage.getItem("accessibility-settings")
    if (saved) {
      try {
        setSettings(JSON.parse(saved))
      } catch (e) {
        console.warn("Failed to parse accessibility settings")
      }
    }

    // Detect system preferences
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const prefersHighContrast = window.matchMedia("(prefers-contrast: high)").matches

    setSettings((prev) => ({
      ...prev,
      reducedMotion: prefersReducedMotion,
      highContrast: prefersHighContrast,
    }))
  }, [])

  useEffect(() => {
    // Apply accessibility settings to document
    const root = document.documentElement

    root.classList.toggle("high-contrast", settings.highContrast)
    root.classList.toggle("reduced-motion", settings.reducedMotion)
    root.setAttribute("data-font-size", settings.fontSize)

    // Save to localStorage
    localStorage.setItem("accessibility-settings", JSON.stringify(settings))
  }, [settings])

  const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }))
  }

  const announceToScreenReader = (message: string) => {
    setAnnouncements((prev) => [...prev, message])
    setTimeout(() => {
      setAnnouncements((prev) => prev.slice(1))
    }, 1000)
  }

  return (
    <AccessibilityContext.Provider value={{ settings, updateSettings, announceToScreenReader }}>
      {children}

      {/* Screen reader announcements */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {announcements.map((announcement, index) => (
          <div key={index}>{announcement}</div>
        ))}
      </div>

      {/* Skip to main content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md"
      >
        Skip to main content
      </a>
    </AccessibilityContext.Provider>
  )
}
