"use client"

import { useState } from "react"
import { AlertCircle, Loader } from "lucide-react"
import { saveReservationToFirestore } from "../lib/save-reservation"
import { sendConfirmationEmail } from "../lib/send-confirmation-email"
import { SuccessModal } from "./success-modal"

interface ReservationData {
  tripType: "simple" | "hourly"
  departure: string
  destination: string
  waypoints: string[]
  duration?: string
  date: string
  time: string
  passengers: string
  selectedVehicle: {
    id: string
    name: string
    basePrice: number
    pricePerKm?: number
    pricePerHour?: number
  }
  selectedOptions: Array<{ id: string; name: string; price: number }>
  personalInfo: {
    firstName: string
    lastName: string
    phone: string
    email: string
    flightNumber: string
  }
  totalPrice: number
  distance?: number
  vehicleBasePrice: number
}

interface CashPaymentFormProps {
  reservationData: ReservationData
  onSuccess: () => void
  onError: (error: string) => void
  onProcessing: (processing: boolean) => void
}

export function CashPaymentForm({ reservationData, onSuccess, onError, onProcessing }: CashPaymentFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const handleConfirmPayment = async () => {
    setLoading(true)
    onProcessing(true)

    try {
      const reservationId = await saveReservationToFirestore(reservationData, "cash", "")
      await sendConfirmationEmail(reservationData, reservationId, "Espèces")
      onProcessing(false)
      setShowSuccessModal(true)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de l'enregistrement"
      setError(errorMessage)
      onError(errorMessage)
      setLoading(false)
      onProcessing(false)
    }
  }

  return (
    <>
      <div className="space-y-6">
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h3 className="font-semibold text-gray-900 mb-3">Détails du paiement</h3>
          <div className="space-y-2 text-sm text-gray-700">
            <p>
              <strong>Montant:</strong> {reservationData.totalPrice.toFixed(2)}€
            </p>
            <p>
              <strong>Méthode:</strong> Paiement en espèces à la livraison
            </p>
            <p>
              <strong>Véhicule:</strong> {reservationData.selectedVehicle.name}
            </p>
            <p>
              <strong>Chauffeur:</strong> Vous sera contacté avant l'arrivée
            </p>
          </div>
        </div>

        <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
          <p className="text-sm text-amber-800">
            ⚠️ Assurez-vous d'avoir le montant exact en espèces au moment de la livraison.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <button
          onClick={handleConfirmPayment}
          disabled={loading}
          className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Enregistrement...
            </>
          ) : (
            "Confirmer la réservation"
          )}
        </button>
      </div>

      <SuccessModal
        email={reservationData.personalInfo.email}
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false)
          onSuccess()
        }}
      />
    </>
  )
}
