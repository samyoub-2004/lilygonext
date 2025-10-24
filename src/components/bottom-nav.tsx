"use client"

import { Phone, MessageCircle } from "lucide-react"

export default function BottomNav() {
  const handleCall = () => {
    window.location.href = "tel:+33123456789"
  }

  const handleWhatsApp = () => {
    window.open("https://wa.me/33123456789", "_blank")
  }

  const handleReservation = () => {
    window.location.href = "/book"
  }

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
      <div className="glass rounded-full px-2 py-3 flex items-center gap-2 shadow-2xl">
        {/* Call Button */}
        <button
          onClick={handleCall}
          className="p-3 rounded-full hover:bg-accent/20 transition-all duration-300 group"
          title="Appeler"
        >
          <Phone className="w-5 h-5 text-accent group-hover:scale-110 transition-transform" />
        </button>

        {/* WhatsApp Button */}
        <button
          onClick={handleWhatsApp}
          className="p-3 rounded-full hover:bg-accent/20 transition-all duration-300 group"
          title="WhatsApp"
        >
          <MessageCircle className="w-5 h-5 text-accent group-hover:scale-110 transition-transform" />
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-border" />

        <button
          onClick={handleReservation}
          className="px-6 py-2 gradient-button rounded-full font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 text-sm"
        >
          Réserver
        </button>

      </div>
    </div>
  )
}
