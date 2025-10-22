"use client"

import { useEffect, useRef, useState } from "react"
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

interface PayPalPaymentFormProps {
  reservationData: ReservationData
  onSuccess: () => void
  onError: (error: string) => void
  onProcessing: (processing: boolean) => void
}

export function PayPalPaymentForm({ reservationData, onSuccess, onError, onProcessing }: PayPalPaymentFormProps) {
  const paypalContainerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  useEffect(() => {
    const script = document.createElement("script")
    script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=EUR`
    script.async = true
    script.onload = () => {
      if (window.paypal) {
        renderPayPalButtons()
      }
    }
    script.onerror = () => {
      setError("Erreur lors du chargement de PayPal")
      setLoading(false)
    }
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const renderPayPalButtons = () => {
    if (!window.paypal || !paypalContainerRef.current) return

    paypalContainerRef.current.innerHTML = ""

    window.paypal
      .Buttons({
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: reservationData.totalPrice.toFixed(2),
                  currency_code: "EUR",
                },
                description: `Réservation ${reservationData.selectedVehicle.name}`,
              },
            ],
          })
        },
        onApprove: async (data: any, actions: any) => {
          onProcessing(true)
          try {
            const details = await actions.order.capture()

            const reservationId = await saveReservationToFirestore(reservationData, "paypal", details.id)
            await sendConfirmationEmail(reservationData, reservationId, "PayPal")
            onProcessing(false)
            setShowSuccessModal(true)
          } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Erreur lors du paiement PayPal"
            setError(errorMessage)
            onError(errorMessage)
            onProcessing(false)
          }
        },
        onError: (err: any) => {
          const errorMessage = "Erreur lors du paiement PayPal"
          setError(errorMessage)
          onError(errorMessage)
        },
      })
      .render(paypalContainerRef.current)

    setLoading(false)
  }

  return (
    <>
      <div className="space-y-6">
        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader className="w-6 h-6 animate-spin text-orange-500" />
          </div>
        )}

        <div ref={paypalContainerRef} className="min-h-[60px]" />
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
