import type { ReservationData } from "@/types/reservation"

interface ReservationDetails {
  reservationId: string
  customerName: string
  phone: string
  email: string
  date: string
  passengers: string
  paymentMethod: string
  departure: string
  destination: string
  distance?: string
  vehicle: string
  options: string[]
  totalPrice: string
  waypoints?: string[]
  stops?: string[]
}

export async function sendConfirmationEmail(
  reservationData: ReservationData,
  reservationId: string,
  paymentMethod: string,
) {
  try {
    const isHourly = reservationData.tripType === "hourly"
    const emailUrl = isHourly
      ? "https://sendconfirmationemailhourly-3ritbjjw3a-uc.a.run.app"
      : "https://sendconfirmationemailsimple-3ritbjjw3a-uc.a.run.app"

    const reservationDetails: ReservationDetails = {
      reservationId,
      customerName: `${reservationData.personalInfo.firstName} ${reservationData.personalInfo.lastName}`,
      phone: reservationData.personalInfo.phone,
      email: reservationData.personalInfo.email,
      date: `${reservationData.date} à ${reservationData.time}`,
      passengers: reservationData.passengers,
      paymentMethod,
      departure: reservationData.departure,
      destination: reservationData.destination,
      distance: reservationData.distance ? `${reservationData.distance} km` : undefined,
      vehicle: reservationData.selectedVehicle.name,
      options: reservationData.selectedOptions.map((opt) => opt.name),
      totalPrice: reservationData.totalPrice.toFixed(2),
      ...(isHourly ? { stops: reservationData.waypoints } : { waypoints: reservationData.waypoints }),
    }

    const response = await fetch(emailUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: reservationData.personalInfo.email,
        subject: isHourly
          ? "Confirmation de votre réservation horaire - VTC LILYGO"
          : "Confirmation de votre réservation - VTC LILYGO",
        reservationDetails,
      }),
    })

    if (!response.ok) {
      console.error("[v0] Email send failed:", response.statusText)
      throw new Error("Erreur lors de l'envoi de l'email de confirmation")
    }

    console.log("[v0] Confirmation email sent successfully")
    return true
  } catch (error) {
    console.error("[v0] Error sending confirmation email:", error)
    throw error
  }
}
