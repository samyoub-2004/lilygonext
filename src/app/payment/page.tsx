"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CreditCard, DollarSign, Banknote, ChevronLeft, X, Loader } from "lucide-react"
import { StripePaymentForm } from "../../components/stripe-payment-form"
import { PayPalPaymentForm } from "../../components/paypal-payment-form"
import { CashPaymentForm } from "../../components/cash-payment-form"

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

type PaymentMethod = "stripe" | "paypal" | "cash" | null

export default function PaymentPage() {
  const router = useRouter()
  const [reservationData, setReservationData] = useState<ReservationData | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    const storedData = localStorage.getItem("reservationData")

    if (storedData) {
      try {
        const data = JSON.parse(storedData)
        setReservationData(data)
      } catch (error) {
        console.error("[v0] Error parsing reservation data:", error)
        router.push("/")
      }
    } else {
      router.push("/")
    }

    setLoading(false)
  }, [router])

  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    setPaymentMethod(method)
  }

  const handlePaymentSuccess = async () => {
    setProcessing(true)
    try {
      // Payment successful - redirect to confirmation
      localStorage.removeItem("reservationData")
      router.push("/confirmation")
    } catch (error) {
      console.error("[v0] Error after payment:", error)
      setProcessing(false)
    }
  }

  const handlePaymentError = (error: string) => {
    console.error("[v0] Payment error:", error)
    setProcessing(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!reservationData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
        <div className="text-center">
          <p className="text-gray-600">Aucune donnée de réservation trouvée.</p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all shadow-lg hover:shadow-xl"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* En-tête */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => router.back()} className="p-2 hover:bg-white rounded-full transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-serif font-bold text-gray-900">Paiement</h1>
            <p className="text-gray-600 mt-2">Choisissez votre méthode de paiement</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Résumé de la réservation */}
          <div className="lg:col-span-1">
            <div className="glass rounded-2xl p-6 sticky top-8">
              <h2 className="text-xl font-serif font-bold text-gray-900 mb-4">Résumé</h2>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Véhicule</p>
                  <p className="font-semibold text-gray-900">{reservationData.selectedVehicle.name}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Passagers</p>
                  <p className="font-semibold text-gray-900">{reservationData.passengers}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(reservationData.date).toLocaleDateString("fr-FR")}
                  </p>
                </div>

                {reservationData.tripType === "simple" && reservationData.distance && (
                  <div>
                    <p className="text-sm text-gray-500">Distance</p>
                    <p className="font-semibold text-gray-900">{reservationData.distance} km</p>
                  </div>
                )}

                {reservationData.tripType === "hourly" && (
                  <div>
                    <p className="text-sm text-gray-500">Durée</p>
                    <p className="font-semibold text-gray-900">{reservationData.duration} heure(s)</p>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Véhicule:</span>
                  <span className="font-semibold">{reservationData.vehicleBasePrice.toFixed(2)}€</span>
                </div>

                {reservationData.selectedOptions.length > 0 && (
                  <>
                    {reservationData.selectedOptions.map((option) => (
                      <div key={option.id} className="flex justify-between items-center mb-2 text-sm">
                        <span className="text-gray-600">{option.name}:</span>
                        <span className="font-semibold">+{option.price.toFixed(2)}€</span>
                      </div>
                    ))}
                  </>
                )}

                <div className="flex justify-between items-center pt-3 border-t border-gray-200 mt-3">
                  <span className="font-bold text-gray-900">Total:</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                    {reservationData.totalPrice.toFixed(2)}€
                  </span>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <p className="text-sm text-blue-700">
                  <strong>Nom:</strong> {reservationData.personalInfo.firstName} {reservationData.personalInfo.lastName}
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  <strong>Email:</strong> {reservationData.personalInfo.email}
                </p>
              </div>
            </div>
          </div>

          {/* Méthodes de paiement */}
          <div className="lg:col-span-2">
            {!paymentMethod ? (
              <div className="space-y-4">
                {/* Stripe */}
                <button
                  onClick={() => handlePaymentMethodSelect("stripe")}
                  className="w-full glass rounded-2xl p-6 hover:shadow-lg transition-all border-2 border-transparent hover:border-orange-200 text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl">
                      <CreditCard className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold text-gray-900">Carte bancaire</h3>
                      <p className="text-sm text-gray-600">Visa, Mastercard, American Express</p>
                    </div>
                    <div className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                      {reservationData.totalPrice.toFixed(2)}€
                    </div>
                  </div>
                </button>

                {/* PayPal */}
                <button
                  onClick={() => handlePaymentMethodSelect("paypal")}
                  className="w-full glass rounded-2xl p-6 hover:shadow-lg transition-all border-2 border-transparent hover:border-orange-200 text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl">
                      <DollarSign className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold text-gray-900">PayPal</h3>
                      <p className="text-sm text-gray-600">Paiement sécurisé via PayPal</p>
                    </div>
                    <div className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                      {reservationData.totalPrice.toFixed(2)}€
                    </div>
                  </div>
                </button>

                {/* Espèces */}
                <button
                  onClick={() => handlePaymentMethodSelect("cash")}
                  className="w-full glass rounded-2xl p-6 hover:shadow-lg transition-all border-2 border-transparent hover:border-orange-200 text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl">
                      <Banknote className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold text-gray-900">Paiement à la livraison</h3>
                      <p className="text-sm text-gray-600">Payez en espèces à l'arrivée</p>
                    </div>
                    <div className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                      {reservationData.totalPrice.toFixed(2)}€
                    </div>
                  </div>
                </button>
              </div>
            ) : (
              <div className="glass rounded-2xl p-8 border border-white/20">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-serif font-bold text-gray-900">
                    {paymentMethod === "stripe" && "Paiement par carte"}
                    {paymentMethod === "paypal" && "Paiement PayPal"}
                    {paymentMethod === "cash" && "Paiement à la livraison"}
                  </h2>
                  <button
                    onClick={() => setPaymentMethod(null)}
                    disabled={processing}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors disabled:opacity-50"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {paymentMethod === "stripe" && (
                  <StripePaymentForm
                    reservationData={reservationData}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                    onProcessing={setProcessing}
                  />
                )}

                {paymentMethod === "paypal" && (
                  <PayPalPaymentForm
                    reservationData={reservationData}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                    onProcessing={setProcessing}
                  />
                )}

                {paymentMethod === "cash" && (
                  <CashPaymentForm
                    reservationData={reservationData}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                    onProcessing={setProcessing}
                  />
                )}

                {processing && (
                  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 text-center">
                      <Loader className="w-12 h-12 animate-spin text-orange-500 mx-auto mb-4" />
                      <p className="text-gray-600">Traitement du paiement...</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
