"use client"

import { useState, useEffect } from "react"
import PageLoader from "../components/page-loader"
import ScrollIndicator from "../components/scroll-indicator"
import Navbar from "../components/navbar"
import Hero from "../components/sections/hero"
import Services from "../components/sections/services"
import FAQ from "../components/sections/faq"
import Footer from "../components/sections/footer"
import BottomNav from "../components/bottom-nav"
import type { Language } from "@/lib/i18n"

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
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

    const timer = setTimeout(() => setIsLoading(false), 2500)
    return () => clearTimeout(timer)
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

  if (isLoading) {
    return <PageLoader />
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="relative">
      <ScrollIndicator />
      <Navbar language={language} onLanguageChange={handleLanguageChange} />

      <main className="overflow-hidden">
        <Hero language={language} />
        <Services language={language} />
        <FAQ language={language} />
        <Footer language={language} />
      </main>

      <BottomNav />
    </div>
  )
}
