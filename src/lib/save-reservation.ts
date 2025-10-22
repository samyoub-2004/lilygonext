import { db } from "./firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"

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

export async function saveReservationToFirestore(
  reservationData: ReservationData,
  paymentMethod: "stripe" | "paypal" | "cash",
  paymentId: string,
) {
  try {
    const reservationsCollection = collection(db, "reservations")

    const reservationDoc = {
      // Trip details
      type: reservationData.tripType,
      departure: reservationData.departure,
      destination: reservationData.destination,
      waypoints: reservationData.waypoints,
      date: reservationData.date,
      duration: reservationData.duration || null,
      distance: reservationData.distance || null,
      distanceValue: reservationData.distance || 0,

      // Vehicle and options
      selectedVehicle: reservationData.selectedVehicle.id,
      selectedOptions: reservationData.selectedOptions.map((opt) => opt.id),

      // Guest info
      guestInfo: {
        firstName: reservationData.personalInfo.firstName,
        lastName: reservationData.personalInfo.lastName,
        email: reservationData.personalInfo.email,
        phone: reservationData.personalInfo.phone,
        passengers: reservationData.passengers,
        flightNumber: reservationData.personalInfo.flightNumber || "",
      },

      // Payment info
      paymentMethod: paymentMethod,
      paymentId: paymentId,
      paymentStatus: paymentMethod === "cash" ? "pending" : "completed",

      // Pricing
      totalPrice: reservationData.totalPrice,

      // Status
      status: "pending",
      createdAt: serverTimestamp(),
    }

    const docRef = await addDoc(reservationsCollection, reservationDoc)
    console.log("[v0] Reservation saved with ID:", docRef.id)
    return docRef.id
  } catch (error) {
    console.error("[v0] Error saving reservation:", error)
    throw error
  }
}
