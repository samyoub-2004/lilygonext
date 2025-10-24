"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

const STORAGE_KEY = "cookie-consent"

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    const consent = window.localStorage.getItem(STORAGE_KEY)
    if (!consent) {
      setVisible(true)
    }
  }, [])

  if (!visible) {
    return null
  }

  const handleAccept = () => {
    window.localStorage.setItem(STORAGE_KEY, "accepted")
    setVisible(false)
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-6">
      <div className="mx-auto max-w-5xl rounded-2xl bg-white/95 shadow-xl backdrop-blur p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3 text-sm text-gray-700">
            <h2 className="text-base font-semibold text-gray-900">Nous utilisons des cookies</h2>
            <p>
              Ces cookies essentiels garantissent le bon fonctionnement du site et l&apos;optimisation de votre expérience.
              En poursuivant votre navigation, vous acceptez leur utilisation.
            </p>
            <p>
              Pour en savoir plus, consultez notre {""}
              <Link href="/privacy" className="text-orange-600 hover:text-orange-800 underline">
                Politique de confidentialité
              </Link>
              .
            </p>
          </div>
          <button
            onClick={handleAccept}
            className="w-full md:w-auto whitespace-nowrap rounded-full bg-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-[1.01]"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  )
}
