"use client"

import { useEffect, useState } from "react"

const sections = [{ id: "hero" }, { id: "services" }, { id: "faq" }, { id: "footer" }]

export default function ScrollIndicator() {
  const [activeSection, setActiveSection] = useState("hero")

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section.id)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="fixed left-8 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-8">
      {sections.map((section) => (
        <div
          key={section.id}
          className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
            activeSection === section.id
              ? "bg-gradient-to-r from-red-500 to-orange-500 scale-125 shadow-lg shadow-red-500/50"
              : "bg-muted-foreground/30 hover:bg-muted-foreground/60"
          }`}
          onClick={() => {
            const element = document.getElementById(section.id)
            if (element) {
              element.scrollIntoView({ behavior: "smooth" })
            }
          }}
        />
      ))}
    </div>
  )
}
