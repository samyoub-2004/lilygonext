"use client"

import { useEffect, useState } from "react"

export default function PageLoader() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 2500)
    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-secondary/10 animate-pulse" />
      </div>

      {/* Loader content */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Animated spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent border-r-accent animate-spin" />
          <div
            className="absolute inset-2 rounded-full border-2 border-transparent border-b-secondary animate-spin"
            style={{ animationDirection: "reverse", animationDuration: "3s" }}
          />
        </div>

        {/* Text */}
        <div className="text-center">
          <h1 className="text-2xl font-serif font-bold text-foreground">LILYGO</h1>
          <p className="text-sm text-muted-foreground mt-2">Chargement de votre expérience premium...</p>
        </div>
      </div>
    </div>
  )
}
