"use client"

import { useState } from "react"
import { MessageCircle } from "lucide-react"
import { useIsMobile } from "./ui/use-mobile"

export default function LilyGoChat() {
  const [isToggled, setIsToggled] = useState(false)
  const isMobile = useIsMobile()

  const handleToggle = () => {
    setIsToggled((prev) => !prev)
  }

  return (
    <>
      {!isMobile && (
        <button
          type="button"
          onClick={handleToggle}
          className={`relative inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all backdrop-blur ${
            isToggled ? "opacity-75" : ""
          }`}
        >
          <span className="inline-flex items-center justify-center bg-white/20 rounded-full p-1.5">
            <MessageCircle className="w-4 h-4" />
          </span>
          LilyGo
          <span className="absolute -top-2 -right-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-white text-orange-500 text-[10px] font-bold shadow-md">
            •
          </span>
        </button>
      )}
    </>
  )
}
