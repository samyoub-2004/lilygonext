"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Calendar, MapPin, Users, Clock, Zap, ChevronDown, ChevronUp, Plus, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useGoogleMaps } from "../hooks/use-google-maps"

type TripType = "simple" | "hourly"

declare global {
  interface Window {
    google: any
  }
}

interface Suggestion {
  description: string
  place_id: string
}

interface ReservationData {
  tripType: TripType
  departure: string
  destination: string
  waypoints: string[]
  duration: string
  date: string
  time: string
  passengers: string
}

export default function ReservationForm() {
  const router = useRouter()
  const { isLoaded: isGoogleMapsLoaded } = useGoogleMaps()
  const [tripType, setTripType] = useState<TripType>("simple")
  const [formData, setFormData] = useState({
    departure: "",
    destination: "",
    duration: "",
    date: "",
    time: "",
    passengers: "1",
  })
  const [waypoints, setWaypoints] = useState<string[]>([])

  const departureInputRef = useRef<HTMLInputElement>(null)
  const destinationInputRef = useRef<HTMLInputElement>(null)
  const waypointInputRefs = useRef<(HTMLInputElement | null)[]>([])

  const [departureSuggestions, setDepartureSuggestions] = useState<Suggestion[]>([])
  const [destinationSuggestions, setDestinationSuggestions] = useState<Suggestion[]>([])
  const [waypointSuggestions, setWaypointSuggestions] = useState<Suggestion[][]>([])

  const [showDepartureSuggestions, setShowDepartureSuggestions] = useState(false)
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false)
  const [showWaypointSuggestions, setShowWaypointSuggestions] = useState<boolean[]>([])

  useEffect(() => {
    setWaypointSuggestions(Array(waypoints.length).fill([]))
    setShowWaypointSuggestions(Array(waypoints.length).fill(false))
    waypointInputRefs.current = waypointInputRefs.current.slice(0, waypoints.length)
  }, [waypoints.length])

  const getPlaceSuggestions = (input: string, callback: (suggestions: Suggestion[]) => void) => {
    if (!isGoogleMapsLoaded || !window.google || !input) {
      callback([])
      return
    }

    const service = new window.google.maps.places.AutocompleteService()
    service.getPlacePredictions(
      {
        input,
        types: ["geocode", "establishment"],
        componentRestrictions: { country: "fr" },
      },
      (predictions: any[], status: string) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
          const suggestions = predictions.map((prediction) => ({
            description: prediction.description,
            place_id: prediction.place_id,
          }))
          callback(suggestions)
        } else {
          callback([])
        }
      },
    )
  }

  const handleDepartureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFormData((prev) => ({ ...prev, departure: value }))

    if (value.length > 2) {
      getPlaceSuggestions(value, (suggestions) => {
        setDepartureSuggestions(suggestions)
        setShowDepartureSuggestions(suggestions.length > 0)
      })
    } else {
      setDepartureSuggestions([])
      setShowDepartureSuggestions(false)
    }
  }

  const handleDestinationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFormData((prev) => ({ ...prev, destination: value }))

    if (value.length > 2) {
      getPlaceSuggestions(value, (suggestions) => {
        setDestinationSuggestions(suggestions)
        setShowDestinationSuggestions(suggestions.length > 0)
      })
    } else {
      setDestinationSuggestions([])
      setShowDestinationSuggestions(false)
    }
  }

  const handleWaypointChange = (index: number, value: string) => {
    const newWaypoints = [...waypoints]
    newWaypoints[index] = value
    setWaypoints(newWaypoints)

    if (value.length > 2) {
      getPlaceSuggestions(value, (suggestions) => {
        const newSuggestions = [...waypointSuggestions]
        newSuggestions[index] = suggestions
        setWaypointSuggestions(newSuggestions)

        const newShow = [...showWaypointSuggestions]
        newShow[index] = suggestions.length > 0
        setShowWaypointSuggestions(newShow)
      })
    } else {
      const newSuggestions = [...waypointSuggestions]
      newSuggestions[index] = []
      setWaypointSuggestions(newSuggestions)

      const newShow = [...showWaypointSuggestions]
      newShow[index] = false
      setShowWaypointSuggestions(newShow)
    }
  }

  const addWaypoint = () => {
    setWaypoints([...waypoints, ""])
  }

  const removeWaypoint = (index: number) => {
    const newWaypoints = [...waypoints]
    newWaypoints.splice(index, 1)
    setWaypoints(newWaypoints)

    const newSuggestions = [...waypointSuggestions]
    newSuggestions.splice(index, 1)
    setWaypointSuggestions(newSuggestions)

    const newShow = [...showWaypointSuggestions]
    newShow.splice(index, 1)
    setShowWaypointSuggestions(newShow)
  }

  const selectDepartureSuggestion = (suggestion: Suggestion) => {
    setFormData((prev) => ({ ...prev, departure: suggestion.description }))
    setDepartureSuggestions([])
    setShowDepartureSuggestions(false)
  }

  const selectDestinationSuggestion = (suggestion: Suggestion) => {
    setFormData((prev) => ({ ...prev, destination: suggestion.description }))
    setDestinationSuggestions([])
    setShowDestinationSuggestions(false)
  }

  const selectWaypointSuggestion = (index: number, suggestion: Suggestion) => {
    const newWaypoints = [...waypoints]
    newWaypoints[index] = suggestion.description
    setWaypoints(newWaypoints)

    const newSuggestions = [...waypointSuggestions]
    newSuggestions[index] = []
    setWaypointSuggestions(newSuggestions)

    const newShow = [...showWaypointSuggestions]
    newShow[index] = false
    setShowWaypointSuggestions(newShow)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (departureInputRef.current && !departureInputRef.current.contains(event.target as Node)) {
        setShowDepartureSuggestions(false)
      }
      if (destinationInputRef.current && !destinationInputRef.current.contains(event.target as Node)) {
        setShowDestinationSuggestions(false)
      }

      waypointInputRefs.current.forEach((ref, index) => {
        if (ref && !ref.contains(event.target as Node)) {
          const newShow = [...showWaypointSuggestions]
          newShow[index] = false
          setShowWaypointSuggestions(newShow)
        }
      })
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showWaypointSuggestions])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.departure || !formData.date || !formData.time || !formData.passengers) {
      alert("Veuillez remplir tous les champs obligatoires.")
      return
    }

    if (tripType === "simple" && !formData.destination) {
      alert("Veuillez renseigner la destination pour un trajet simple.")
      return
    }

    if (tripType === "hourly" && !formData.duration) {
      alert("Veuillez sélectionner une durée pour un trajet à l'heure.")
      return
    }

    const reservationData: ReservationData = {
      tripType,
      departure: formData.departure,
      destination: formData.destination,
      waypoints: waypoints.filter((waypoint) => waypoint.trim() !== ""),
      duration: formData.duration,
      date: formData.date,
      time: formData.time,
      passengers: formData.passengers,
    }

    localStorage.setItem("reservationData", JSON.stringify(reservationData))

    router.push("/reservation")
  }

  return (
    <form onSubmit={handleSubmit} className="glass rounded-3xl p-8 space-y-6 border border-white/20">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-serif font-bold text-gray-900">Réservez Votre Trajet</h2>

        <div className="flex gap-2 bg-white/30 rounded-full p-1 border border-white/20">
          <button
            type="button"
            onClick={() => setTripType("simple")}
            className={`px-4 py-2 rounded-full font-semibold transition-all ${
              tripType === "simple"
                ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                : "text-gray-700 hover:text-gray-900"
            }`}
          >
            Trajet Simple
          </button>
          <button
            type="button"
            onClick={() => setTripType("hourly")}
            className={`px-4 py-2 rounded-full font-semibold transition-all ${
              tripType === "hourly"
                ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                : "text-gray-700 hover:text-gray-900"
            }`}
          >
            À l'Heure
          </button>
        </div>
      </div>

      {/* Departure */}
      <div>
        <label className="block text-sm font-semibold mb-3 text-gray-900">Lieu de Départ</label>
        <div className="relative" ref={departureInputRef}>
          <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-orange-500" />
          <input
            type="text"
            placeholder="Où partez-vous ?"
            value={formData.departure}
            onChange={handleDepartureChange}
            onFocus={() => setShowDepartureSuggestions(departureSuggestions.length > 0)}
            className="w-full pl-12 pr-10 py-3 bg-white/80 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
            required
          />
          {showDepartureSuggestions ? (
            <ChevronUp
              className="absolute right-3 top-3.5 w-5 h-5 text-gray-500 cursor-pointer"
              onClick={() => setShowDepartureSuggestions(false)}
            />
          ) : (
            <ChevronDown
              className="absolute right-3 top-3.5 w-5 h-5 text-gray-500 cursor-pointer"
              onClick={() => setShowDepartureSuggestions(departureSuggestions.length > 0)}
            />
          )}

          {showDepartureSuggestions && departureSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto">
              {departureSuggestions.map((suggestion) => (
                <div
                  key={suggestion.place_id}
                  className="px-4 py-3 hover:bg-orange-50 cursor-pointer transition-colors border-b border-gray-200 last:border-b-0"
                  onClick={() => selectDepartureSuggestion(suggestion)}
                >
                  <div className="flex items-start">
                    <MapPin className="w-4 h-4 text-orange-500 mt-1 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-900">{suggestion.description}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {waypoints.map((waypoint, index) => (
        <div key={index}>
          <label className="block text-sm font-semibold mb-3 text-gray-900">Point d'arrêt {index + 1}</label>
          <div className="relative" ref={(el) => (waypointInputRefs.current[index] = el)}>
            <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-blue-500" />
            <input
              type="text"
              placeholder="Ajouter un point d'arrêt"
              value={waypoint}
              onChange={(e) => handleWaypointChange(index, e.target.value)}
              onFocus={() => {
                const newShow = [...showWaypointSuggestions]
                newShow[index] = waypointSuggestions[index]?.length > 0
                setShowWaypointSuggestions(newShow)
              }}
              className="w-full pl-12 pr-16 py-3 bg-white/80 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <button
              type="button"
              onClick={() => removeWaypoint(index)}
              className="absolute right-10 top-3.5 p-1 rounded-full hover:bg-red-100 transition-colors"
            >
              <X className="w-4 h-4 text-red-500" />
            </button>
            {showWaypointSuggestions[index] ? (
              <ChevronUp
                className="absolute right-3 top-3.5 w-5 h-5 text-gray-500 cursor-pointer"
                onClick={() => {
                  const newShow = [...showWaypointSuggestions]
                  newShow[index] = false
                  setShowWaypointSuggestions(newShow)
                }}
              />
            ) : (
              <ChevronDown
                className="absolute right-3 top-3.5 w-5 h-5 text-gray-500 cursor-pointer"
                onClick={() => {
                  const newShow = [...showWaypointSuggestions]
                  newShow[index] = waypointSuggestions[index]?.length > 0
                  setShowWaypointSuggestions(newShow)
                }}
              />
            )}

            {showWaypointSuggestions[index] && waypointSuggestions[index]?.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto">
                {waypointSuggestions[index].map((suggestion) => (
                  <div
                    key={suggestion.place_id}
                    className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-200 last:border-b-0"
                    onClick={() => selectWaypointSuggestion(index, suggestion)}
                  >
                    <div className="flex items-start">
                      <MapPin className="w-4 h-4 text-blue-500 mt-1 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-900">{suggestion.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Add waypoint button */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={addWaypoint}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Ajouter un point d'arrêt
        </button>
      </div>

      {/* Destination */}
      {tripType === "simple" && (
        <div>
          <label className="block text-sm font-semibold mb-3 text-gray-900">Lieu de Destination</label>
          <div className="relative" ref={destinationInputRef}>
            <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-orange-500" />
            <input
              type="text"
              placeholder="Où allez-vous ?"
              value={formData.destination}
              onChange={handleDestinationChange}
              onFocus={() => setShowDestinationSuggestions(destinationSuggestions.length > 0)}
              className="w-full pl-12 pr-10 py-3 bg-white/80 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
              required
            />
            {showDestinationSuggestions ? (
              <ChevronUp
                className="absolute right-3 top-3.5 w-5 h-5 text-gray-500 cursor-pointer"
                onClick={() => setShowDestinationSuggestions(false)}
              />
            ) : (
              <ChevronDown
                className="absolute right-3 top-3.5 w-5 h-5 text-gray-500 cursor-pointer"
                onClick={() => setShowDestinationSuggestions(destinationSuggestions.length > 0)}
              />
            )}

            {showDestinationSuggestions && destinationSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto">
                {destinationSuggestions.map((suggestion) => (
                  <div
                    key={suggestion.place_id}
                    className="px-4 py-3 hover:bg-orange-50 cursor-pointer transition-colors border-b border-gray-200 last:border-b-0"
                    onClick={() => selectDestinationSuggestion(suggestion)}
                  >
                    <div className="flex items-start">
                      <MapPin className="w-4 h-4 text-orange-500 mt-1 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-900">{suggestion.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Duration */}
      {tripType === "hourly" && (
        <div>
          <label className="block text-sm font-semibold mb-3 text-gray-900">Durée</label>
          <div className="relative">
            <Zap className="absolute left-4 top-3.5 w-5 h-5 text-orange-500" />
            <select
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="w-full pl-12 pr-4 py-3 bg-white/80 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
              required
            >
              <option value="">Sélectionnez une durée</option>
              <option value="1">1 heure</option>
              <option value="2">2 heures</option>
              <option value="3">3 heures</option>
              <option value="4">4 heures</option>
              <option value="8">8 heures</option>
              <option value="24">24 heures</option>
            </select>
          </div>
        </div>
      )}

      {/* Date and Time */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-3 text-gray-900">Date</label>
          <div className="relative">
            <Calendar className="absolute left-4 top-3.5 w-5 h-5 text-orange-500" />
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full pl-12 pr-4 py-3 bg-white/80 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-3 text-gray-900">Heure</label>
          <div className="relative">
            <Clock className="absolute left-4 top-3.5 w-5 h-5 text-orange-500" />
            <input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="w-full pl-12 pr-4 py-3 bg-white/80 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
              required
            />
          </div>
        </div>
      </div>

      {/* Passengers */}
      <div>
        <label className="block text-sm font-semibold mb-3 text-gray-900">Nombre de Passagers</label>
        <div className="relative">
          <Users className="absolute left-4 top-3.5 w-5 h-5 text-orange-500" />
          <select
            value={formData.passengers}
            onChange={(e) => setFormData({ ...formData, passengers: e.target.value })}
            className="w-full pl-12 pr-4 py-3 bg-white/80 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>
                {n} passager{n > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold transition-all duration-300 hover:from-orange-600 hover:to-red-600 hover:shadow-lg hover:scale-105"
      >
        Confirmer la Réservation
      </button>

      <p className="text-xs text-center text-gray-600">Service disponible actuellement en France uniquement</p>
    </form>
  )
}
