"use client"

import { useEffect, useState } from "react"

export function useGoogleMaps() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (window.google?.maps) {
      setIsLoaded(true)
      return
    }

    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBLGs7aK3AGCGcRok_d-t5_1KJL1R3sf7o&libraries=places,directions`
    script.async = true
    script.defer = true

    script.onload = () => {
      setIsLoaded(true)
      setError(null)
    }

    script.onerror = () => {
      setError("Erreur lors du chargement de Google Maps")
      setIsLoaded(false)
    }

    document.head.appendChild(script)

    return () => {
      // Cleanup: remove script if component unmounts
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [])

  return { isLoaded, error }
}
