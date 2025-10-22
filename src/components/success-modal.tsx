"use client"

import { useRouter } from "next/navigation"
import { CheckCircle, Mail, Home } from "lucide-react"

interface SuccessModalProps {
  email: string
  isOpen: boolean
  onClose: () => void
}

export function SuccessModal({ email, isOpen, onClose }: SuccessModalProps) {
  const router = useRouter()

  const handleReturnHome = () => {
    onClose()
    router.push("/")
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center space-y-6 animate-in fade-in zoom-in duration-300">
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-full blur-lg opacity-30"></div>
            <CheckCircle className="w-16 h-16 text-green-500 relative" />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Réservation confirmée!</h2>
          <p className="text-gray-600">Votre réservation a été enregistrée avec succès.</p>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 border border-orange-200 space-y-3">
          <div className="flex items-center justify-center gap-2">
            <Mail className="w-5 h-5 text-orange-600" />
            <p className="text-sm font-medium text-gray-900">Email de confirmation envoyé</p>
          </div>
          <p className="text-sm text-gray-700 break-all font-mono bg-white rounded-lg p-2">{email}</p>
          <p className="text-xs text-gray-600">Vérifiez votre boîte de réception et vos spams</p>
        </div>

        <button
          onClick={handleReturnHome}
          className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
        >
          <Home className="w-5 h-5" />
          Retour à l'accueil
        </button>
      </div>
    </div>
  )
}
