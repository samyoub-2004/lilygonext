"use client"

import { useState, useEffect } from "react"
import { ChevronDown } from "lucide-react"
import type { Language } from "../lib/i18n"
import { translations } from "../lib/i18n"

interface NavbarProps {
  language: Language
  onLanguageChange: (lang: Language) => void
}

export default function Navbar({ language, onLanguageChange }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const t = translations[language]

  return (
    <nav
      className={`fixed top-0 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
        isScrolled ? "mt-4" : "mt-0"
      }`}
    >
      <div
        className={`flex items-center gap-8 px-8 py-4 rounded-full transition-all duration-300 ${
          isScrolled ? "glass shadow-lg" : "bg-transparent"
        }`}
      >
        {/* Logo */}
        <a href="/" className="font-serif font-bold text-lg text-accent hover:text-accent/80 transition-colors">
          LILYGO
        </a>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => scrollToSection("services")}
            className="text-sm font-medium hover:text-accent transition-colors"
          >
            {t.nav.services}
          </button>
          <button
            onClick={() => scrollToSection("faq")}
            className="text-sm font-medium hover:text-accent transition-colors"
          >
            {t.nav.faq}
          </button>
          <a href="/blog" className="text-sm font-medium hover:text-accent transition-colors">
            {language === "fr" ? "Blog" : "Blog"}
          </a>
        </div>

        <a href="/blog" className="md:hidden text-sm font-medium hover:text-accent transition-colors">
          {t.nav.blog}
        </a>

        {/* Language Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowLanguageMenu(!showLanguageMenu)}
            className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-accent/10 transition-colors text-sm font-medium"
          >
            {language.toUpperCase()}
            <ChevronDown className={`w-4 h-4 transition-transform ${showLanguageMenu ? "rotate-180" : ""}`} />
          </button>

          {showLanguageMenu && (
            <div className="absolute top-full right-0 mt-2 glass rounded-xl overflow-hidden shadow-lg">
              {(["fr", "en"] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    onLanguageChange(lang)
                    setShowLanguageMenu(false)
                  }}
                  className={`block w-full px-4 py-2 text-sm text-left hover:bg-accent/10 transition-colors ${
                    language === lang ? "bg-accent/20 font-semibold" : ""
                  }`}
                >
                  {lang === "fr" ? "Français" : "English"}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
