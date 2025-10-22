"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../../lib/firebase"
import { MapPin, Users, Luggage, ChevronLeft, X, User, Phone, Mail, Plane, Route } from "lucide-react"
import { useGoogleMaps } from "../../hooks/use-google-maps"
import { waitForGoogleMaps } from "../../lib/wait-for-google-maps"

interface ReservationData {
  tripType: "simple" | "hourly"
  departure: string
  destination: string
  waypoints: string[]
  duration: string
  date: string
  time: string
  passengers: string
}

interface Vehicle {
  id: string
  name: string
  passengers: number
  luggage: number
  imageUrl: string
  basePrice: number
  minimumPrice: number
  pricePerKm: number
  pricePerHour: number
  priceType: string
}

interface CalculatedPrice {
  base: number
  distance: number
  total: number
}

interface AdditionalOption {
  id: string
  name: string
  price: number
  selected: boolean
}

interface PersonalInfo {
  firstName: string
  lastName: string
  phone: string
  email: string
  flightNumber: string
}

export default function VehicleSelectionPage() {
  const router = useRouter()
  const { isLoaded: isGoogleMapsLoaded } = useGoogleMaps()
  const [reservationData, setReservationData] = useState<ReservationData | null>(null)
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [distance, setDistance] = useState<number | null>(null)
  const [priceCalculations, setPriceCalculations] = useState<{ [key: string]: CalculatedPrice }>({})
  const [showOptionsModal, setShowOptionsModal] = useState(false)
  const [showPersonalInfoModal, setShowPersonalInfoModal] = useState(false)
  const [additionalOptions, setAdditionalOptions] = useState<AdditionalOption[]>([
    { id: "airportVIP", name: "Service VIP aéroport", price: 30, selected: false },
    { id: "babySeat", name: "Siège bébé (0-12 mois)", price: 10, selected: false },
    { id: "childSeat", name: "Siège enfant (1-4 ans)", price: 10, selected: false },
    { id: "boosterSeat", name: "Siège d'appoint (4-8 ans)", price: 10, selected: false },
    { id: "pets", name: "Transport d'animaux domestiques", price: 20, selected: false },
    { id: "earlyArrival", name: "Arrivée anticipée (15 min)", price: 0, selected: false },
  ])
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    flightNumber: "",
  })
  const [selectedVehiclePrice, setSelectedVehiclePrice] = useState(0)

  useEffect(() => {
    const storedData = localStorage.getItem("reservationData")

    if (storedData) {
      const data = JSON.parse(storedData)
      setReservationData(data)
      loadVehicles(data)
    } else {
      router.push("/")
    }
  }, [router])

  const loadVehicles = async (reservationData: ReservationData) => {
    try {
      setLoading(true)

      const vehiclesCollection = collection(db, "vehicles")
      const vehicleSnapshot = await getDocs(vehiclesCollection)
      const vehiclesList = vehicleSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Vehicle[]

      const passengers = Number.parseInt(reservationData.passengers)
      const filteredVehicles = vehiclesList.filter((vehicle) => vehicle.passengers >= passengers)

      setVehicles(filteredVehicles)

      if (reservationData.tripType === "simple") {
        try {
          await waitForGoogleMaps()
          await calculateDistanceWithWaypoints(
            reservationData.departure,
            reservationData.destination,
            reservationData.waypoints,
            filteredVehicles,
            reservationData,
          )
        } catch (error) {
          console.error("[v0] Google Maps loading error:", error)
          // Fallback to default distance if Google Maps fails
          const defaultDistance = 10
          setDistance(defaultDistance)
          calculateSimplePrices(filteredVehicles, defaultDistance, reservationData)
        }
      } else {
        calculateHourlyPrices(filteredVehicles, reservationData)
      }
    } catch (error) {
      console.error("Erreur lors du chargement des véhicules:", error)
    } finally {
      setLoading(false)
    }
  }

  const calculateDistanceWithWaypoints = async (
    departure: string,
    destination: string,
    waypoints: string[],
    vehicles: Vehicle[],
    reservationData: ReservationData,
  ) => {
    if (!window.google?.maps) {
      console.error("[v0] Google Maps API not available")
      return
    }

    try {
      const service = new window.google.maps.DirectionsService()

      const waypointsForApi = waypoints
        .filter((wp) => wp.trim() !== "")
        .map((wp) => ({
          location: wp,
          stopover: true,
        }))

      service.route(
        {
          origin: departure,
          destination: destination,
          waypoints: waypointsForApi.length > 0 ? waypointsForApi : undefined,
          travelMode: window.google.maps.TravelMode.DRIVING,
          unitSystem: window.google.maps.UnitSystem.METRIC,
        },
        (response, status) => {
          if (status === "OK" && response) {
            let totalDistance = 0
            response.routes[0].legs.forEach((leg) => {
              totalDistance += leg.distance.value
            })
            const distanceInKm = Math.ceil(totalDistance / 1000)
            setDistance(distanceInKm)
            calculateSimplePrices(vehicles, distanceInKm, reservationData)
          } else {
            console.error("[v0] Distance calculation error:", status)
            const defaultDistance = 10
            setDistance(defaultDistance)
            calculateSimplePrices(vehicles, defaultDistance, reservationData)
          }
        },
      )
    } catch (error) {
      console.error("[v0] Error calculating distance:", error)
      const defaultDistance = 10
      setDistance(defaultDistance)
      calculateSimplePrices(vehicles, defaultDistance, reservationData)
    }
  }

  const calculateSimplePrices = (vehicles: Vehicle[], distance: number, reservationData: ReservationData) => {
    const calculations: { [key: string]: CalculatedPrice } = {}

    vehicles.forEach((vehicle) => {
      const distancePrice = distance * vehicle.pricePerKm
      let total = vehicle.basePrice + distancePrice

      if (total < vehicle.minimumPrice) {
        total = vehicle.minimumPrice
      }

      calculations[vehicle.id] = {
        base: vehicle.basePrice,
        distance: distancePrice,
        total: Number.parseFloat(total.toFixed(2)),
      }
    })

    setPriceCalculations(calculations)
  }

  const calculateHourlyPrices = (vehicles: Vehicle[], reservationData: ReservationData) => {
    const calculations: { [key: string]: CalculatedPrice } = {}
    const duration = Number.parseInt(reservationData.duration)

    vehicles.forEach((vehicle) => {
      const hourlyPrice = duration * vehicle.pricePerHour
      const total = vehicle.basePrice + hourlyPrice

      calculations[vehicle.id] = {
        base: vehicle.basePrice,
        distance: hourlyPrice,
        total: Number.parseFloat(total.toFixed(2)),
      }
    })

    setPriceCalculations(calculations)
  }

  const handleVehicleSelect = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    setSelectedVehiclePrice(priceCalculations[vehicle.id]?.total || 0)
    setShowOptionsModal(true)
  }

  const handleOptionToggle = (optionId: string) => {
    setAdditionalOptions((prev) =>
      prev.map((option) => (option.id === optionId ? { ...option, selected: !option.selected } : option)),
    )
  }

  const calculateTotalWithOptions = () => {
    const basePrice = selectedVehiclePrice
    const optionsTotal = additionalOptions
      .filter((option) => option.selected)
      .reduce((total, option) => total + option.price, 0)

    return Number.parseFloat((basePrice + optionsTotal).toFixed(2))
  }

  const handleContinueToPersonalInfo = () => {
    setShowOptionsModal(false)
    setShowPersonalInfoModal(true)
  }

  const handlePersonalInfoChange = (field: keyof PersonalInfo, value: string) => {
    setPersonalInfo((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleFinalSubmit = () => {
    if (!selectedVehicle || !reservationData) return

    const selectedOptions = additionalOptions.filter((option) => option.selected)
    const totalWithOptions = calculateTotalWithOptions()

    const completeReservationData = {
      ...reservationData,
      selectedVehicle: selectedVehicle,
      selectedOptions: selectedOptions,
      personalInfo: personalInfo,
      totalPrice: totalWithOptions,
      distance: distance,
      vehicleBasePrice: selectedVehiclePrice,
    }

    localStorage.setItem("reservationData", JSON.stringify(completeReservationData))

    router.push("/payment")
  }

  const isPersonalInfoValid = () => {
    return (
      personalInfo.firstName.trim() !== "" &&
      personalInfo.lastName.trim() !== "" &&
      personalInfo.phone.trim() !== "" &&
      personalInfo.email.trim() !== "" &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personalInfo.email)
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Recherche des véhicules disponibles...</p>
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
          <button onClick={() => router.push("/")} className="p-2 hover:bg-white rounded-full transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-serif font-bold text-gray-900">Choisissez votre véhicule</h1>
            <p className="text-gray-600 mt-2">
              {reservationData.tripType === "simple"
                ? `De ${reservationData.departure} à ${reservationData.destination}`
                : `${reservationData.duration} heure(s) à partir de ${reservationData.departure}`}
            </p>
          </div>
        </div>

        {/* Informations du trajet */}
        <div className="glass rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-sm text-gray-500">Départ</p>
                <p className="font-semibold">{reservationData.departure}</p>
              </div>
            </div>

            {reservationData.tripType === "simple" && (
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm text-gray-500">Destination</p>
                  <p className="font-semibold">{reservationData.destination}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Passagers</p>
                <p className="font-semibold">{reservationData.passengers}</p>
              </div>
            </div>
          </div>

          {reservationData.waypoints && reservationData.waypoints.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-start gap-3">
                <Route className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-2">Points d'arrêt</p>
                  <div className="space-y-1">
                    {reservationData.waypoints.map((waypoint, index) => (
                      <p key={index} className="text-sm font-medium text-gray-700">
                        {index + 1}. {waypoint}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {distance && reservationData.tripType === "simple" && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                Distance estimée : <strong>{distance} km</strong>
              </p>
            </div>
          )}
        </div>

        {/* Liste des véhicules */}
        <div className="space-y-6">
          {vehicles.map((vehicle) => {
            const priceInfo = priceCalculations[vehicle.id]

            return (
              <div
                key={vehicle.id}
                className="glass rounded-2xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-orange-200"
                onClick={() => handleVehicleSelect(vehicle)}
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Image du véhicule */}
                  <div className="flex-shrink-0">
                    <img
                      src={vehicle.imageUrl || "/placeholder.svg"}
                      alt={vehicle.name}
                      className="w-full md:w-48 h-32 object-cover rounded-xl"
                    />
                  </div>

                  {/* Détails du véhicule */}
                  <div className="flex-grow">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{vehicle.name}</h3>

                    <div className="flex flex-wrap gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{vehicle.passengers} passagers</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Luggage className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{vehicle.luggage} bagages</span>
                      </div>
                    </div>

                    {/* Détails du prix */}
                    {priceInfo && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-2xl font-bold text-orange-600">{priceInfo.total.toFixed(2)}€</p>
                            <p className="text-sm text-gray-500">
                              {reservationData.tripType === "simple"
                                ? "Prix total du trajet"
                                : `Pour ${reservationData.duration} heure(s)`}
                            </p>
                          </div>

                          {reservationData.tripType === "simple" && (
                            <div className="text-right">
                              <p className="text-sm text-gray-600">Base: {priceInfo.base.toFixed(2)}€</p>
                              <p className="text-sm text-gray-600">Distance: {priceInfo.distance.toFixed(2)}€</p>
                            </div>
                          )}

                          {reservationData.tripType === "hourly" && (
                            <div className="text-right">
                              <p className="text-sm text-gray-600">Base: {priceInfo.base.toFixed(2)}€</p>
                              <p className="text-sm text-gray-600">Heures: {priceInfo.distance.toFixed(2)}€</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Message si aucun véhicule */}
        {vehicles.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Aucun véhicule disponible pour {reservationData.passengers} passagers.</p>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all shadow-lg hover:shadow-xl"
            >
              Modifier la réservation
            </button>
          </div>
        )}
      </div>

      {showOptionsModal && selectedVehicle && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass rounded-3xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto border border-white/20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-serif font-bold text-gray-900">Options supplémentaires</h2>
              <button
                onClick={() => setShowOptionsModal(false)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Véhicule sélectionné</h3>
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-4 border border-orange-100">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedVehicle.imageUrl || "/placeholder.svg"}
                    alt={selectedVehicle.name}
                    className="w-16 h-12 object-cover rounded-lg"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{selectedVehicle.name}</p>
                    <p className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                      {selectedVehiclePrice.toFixed(2)}€
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Options disponibles</h3>
              <div className="space-y-3">
                {additionalOptions.map((option) => (
                  <div
                    key={option.id}
                    className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      option.selected
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 hover:border-orange-300 bg-white/50"
                    }`}
                    onClick={() => handleOptionToggle(option.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                          option.selected
                            ? "bg-gradient-to-r from-orange-500 to-red-500 border-orange-500"
                            : "border-gray-300"
                        }`}
                      >
                        {option.selected && <div className="w-2 h-2 bg-white rounded-sm" />}
                      </div>
                      <span className="font-medium text-gray-900">{option.name}</span>
                    </div>
                    <span className={`font-semibold ${option.price > 0 ? "text-orange-600" : "text-green-600"}`}>
                      {option.price > 0 ? `+${option.price.toFixed(2)}€` : "Gratuit"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-4 mb-6 border border-orange-100">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-gray-900">Prix du véhicule:</span>
                <span className="text-gray-900">{selectedVehiclePrice.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold text-gray-900">Options:</span>
                <span className="text-gray-900">
                  +
                  {additionalOptions
                    .filter((opt) => opt.selected)
                    .reduce((sum, opt) => sum + opt.price, 0)
                    .toFixed(2)}
                  €
                </span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-orange-200">
                <span className="text-lg font-bold text-gray-900">Total:</span>
                <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  {calculateTotalWithOptions().toFixed(2)}€
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowOptionsModal(false)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleContinueToPersonalInfo}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all shadow-lg hover:shadow-xl"
              >
                Continuer
              </button>
            </div>
          </div>
        </div>
      )}

      {showPersonalInfoModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass rounded-3xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto border border-white/20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-serif font-bold text-gray-900">Informations personnelles</h2>
              <button
                onClick={() => setShowPersonalInfoModal(false)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4" />
                  Prénom
                </label>
                <input
                  type="text"
                  value={personalInfo.firstName}
                  onChange={(e) => handlePersonalInfoChange("firstName", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white/80"
                  placeholder="Votre prénom"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4" />
                  Nom
                </label>
                <input
                  type="text"
                  value={personalInfo.lastName}
                  onChange={(e) => handlePersonalInfoChange("lastName", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white/80"
                  placeholder="Votre nom"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Plane className="w-4 h-4" />
                  Numéro de vol (optionnel)
                </label>
                <input
                  type="text"
                  value={personalInfo.flightNumber}
                  onChange={(e) => handlePersonalInfoChange("flightNumber", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white/80"
                  placeholder="Votre numéro de vol"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4" />
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={personalInfo.phone}
                  onChange={(e) => handlePersonalInfoChange("phone", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white/80"
                  placeholder="Votre numéro de téléphone"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                <input
                  type="email"
                  value={personalInfo.email}
                  onChange={(e) => handlePersonalInfoChange("email", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white/80"
                  placeholder="Votre adresse email"
                />
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-4 mb-6 border border-orange-100">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">Total à payer:</span>
                <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  {calculateTotalWithOptions().toFixed(2)}€
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowPersonalInfoModal(false)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Retour
              </button>
              <button
                onClick={handleFinalSubmit}
                disabled={!isPersonalInfoValid()}
                className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                  isPersonalInfoValid()
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-xl"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Procéder au paiement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
