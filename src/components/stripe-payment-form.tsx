"use client"

import type React from "react"

import { useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { AlertCircle, Loader } from "lucide-react"
import { saveReservationToFirestore } from "../lib/save-reservation"
import { sendConfirmationEmail } from "../lib/send-confirmation-email"
import { SuccessModal } from "./success-modal"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "")

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

interface StripePaymentFormProps {
  reservationData: ReservationData
  onSuccess: () => void
  onError: (error: string) => void
  onProcessing: (processing: boolean) => void
}

function StripePaymentFormContent({ reservationData, onSuccess, onError, onProcessing }: StripePaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      setError("Stripe n'est pas chargé")
      return
    }

    setLoading(true)
    onProcessing(true)

    try {
      const cloudFunctionUrl =
        reservationData.tripType === "hourly"
          ? "https://createpaymentintenthourly-3ritbjjw3a-uc.a.run.app"
          : "https://createpaymentintent-3ritbjjw3a-uc.a.run.app"

      const response = await fetch(cloudFunctionUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reservationData: {
            vehicleId: reservationData.selectedVehicle.id,
            distance: reservationData.distance || 0,
            duration: reservationData.duration ? Number.parseInt(reservationData.duration) : 0,
            optionsPrice: reservationData.selectedOptions.reduce((sum, opt) => sum + opt.price, 0),
            totalPrice: reservationData.totalPrice,
          },
          currency: "eur",
        }),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la création du paiement")
      }

      const { clientSecret } = await response.json()

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: {
            name: `${reservationData.personalInfo.firstName} ${reservationData.personalInfo.lastName}`,
            email: reservationData.personalInfo.email,
            phone: reservationData.personalInfo.phone,
          },
        },
      })

      if (result.error) {
        setError(result.error.message || "Erreur de paiement")
        onError(result.error.message || "Erreur de paiement")
      } else if (result.paymentIntent?.status === "succeeded") {
        const reservationId = await saveReservationToFirestore(reservationData, "stripe", result.paymentIntent.id)
        await sendConfirmationEmail(reservationData, reservationId, "Stripe")
        setShowSuccessModal(true)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors du paiement"
      setError(errorMessage)
      onError(errorMessage)
    } finally {
      setLoading(false)
      onProcessing(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-3">Informations de la carte</label>
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424770",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                },
                invalid: {
                  color: "#9e2146",
                },
              },
            }}
          />
        </div>

        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={!stripe || loading}
          className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Traitement...
            </>
          ) : (
            `Payer ${reservationData.totalPrice.toFixed(2)}€`
          )}
        </button>
      </form>

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

export function StripePaymentForm(props: StripePaymentFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <StripePaymentFormContent {...props} />
    </Elements>
  )
}
