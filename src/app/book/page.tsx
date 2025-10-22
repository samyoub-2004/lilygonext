"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import ReservationForm from "../../components/reservation-form"
import Navbar from "../../components/navbar"
import BottomNav from "../../components/bottom-nav"
import type { Language } from "../../lib/i18n"

export default function BookPage() {
  const router = useRouter()
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [language, setLanguage] = useState<Language>("fr")

  useEffect(() => {
    setMounted(true)

    // Load saved language preference
    const savedLanguage = localStorage.getItem("language") as Language | null
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }

    const savedTheme = localStorage.getItem("theme")
    let shouldBeDark = false

    if (savedTheme) {
      shouldBeDark = savedTheme === "dark"
    } else {
      shouldBeDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    }

    setIsDark(shouldBeDark)
    if (shouldBeDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [])

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("language", lang)
  }

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    localStorage.setItem("theme", newTheme ? "dark" : "light")
    if (newTheme) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/5" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <Navbar language={language} onLanguageChange={handleLanguageChange} />
      
      <main className="pt-20 pb-20">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto">
            {/* En-tête de la page */}
            <div className="text-center mb-12">
              <h1 className="text-5xl lg:text-6xl font-serif font-bold mb-6 leading-tight">
                Réservez Votre
                <span className="text-accent"> Trajet</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
                Remplissez le formulaire ci-dessous pour réserver votre transport en toute simplicité
              </p>
            </div>

            {/* Formulaire de réservation */}
            <div className="flex justify-center">
              <div className="w-full max-w-2xl">
                <ReservationForm />
              </div>
            </div>

            {/* Informations supplémentaires */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="glass rounded-2xl p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🚗</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Véhicules Premium</h3>
                <p className="text-sm text-gray-600">Choisissez parmi notre flotte de véhicules haut de gamme</p>
              </div>

              <div className="glass rounded-2xl p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⏰</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Disponible 24h/24</h3>
                <p className="text-sm text-gray-600">Service disponible tous les jours, à toute heure</p>
              </div>

              <div className="glass rounded-2xl p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💳</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Paiement Sécurisé</h3>
                <p className="text-sm text-gray-600">Payez en ligne ou à la livraison selon vos préférences</p>
              </div>
            </div>

            {/* France availability notice */}
            <div className="mt-16 p-6 glass rounded-2xl max-w-2xl mx-auto">
              <p className="text-center text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">📍 Service disponible en France</span>
                <br />
                Nous couvrons toute la France métropolitaine avec nos services de transport premium
              </p>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
