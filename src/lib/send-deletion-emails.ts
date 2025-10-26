export async function sendDeletionRequestConfirmation(
  email: string,
  requestId: string,
  reservationsCount: number
) {
  try {
    // TODO: Remplacer par la vraie URL de cloud function quand elle sera créée
    const emailUrl = "https://senddeletionrequestconfirmation-3ritbjjw3a-uc.a.run.app"

    const response = await fetch(emailUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: email,
        subject: "Confirmation de votre demande de suppression de données - LILYGO",
        templateData: {
          requestId,
          reservationsCount,
          companyName: "LILYGO",
          contactEmail: "contact@lilygo.fr",
          supportPhone: "+33 1 23 45 67 89",
          deletionUrl: `${process.env.NEXT_PUBLIC_SITE_URL || "https://lilygo.fr"}/suppression-compte`,
        },
      }),
    })

    if (!response.ok) {
      console.error("[v0] Deletion confirmation email send failed:", response.statusText)
      throw new Error("Erreur lors de l'envoi de l'email de confirmation de suppression")
    }

    console.log("[v0] Deletion confirmation email sent successfully")
    return true
  } catch (error) {
    console.error("[v0] Error sending deletion confirmation email:", error)
    // TODO: Implementer une solution de fallback (console.log ou service email alternatif)
    console.log("[v0] Fallback: Email de confirmation non envoyé, mais demande sauvegardée")
    return true // Ne pas bloquer le processus
  }
}

export async function sendDeletionCompletedNotification(
  email: string,
  requestId: string,
  deletedReservationsCount: number
) {
  try {
    // TODO: Remplacer par la vraie URL de cloud function quand elle sera créée
    const emailUrl = "https://senddeletioncompletednotification-3ritbjjw3a-uc.a.run.app"

    const response = await fetch(emailUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: email,
        subject: "Suppression de vos données effectuée - LILYGO",
        templateData: {
          requestId,
          deletedReservationsCount,
          companyName: "LILYGO",
          contactEmail: "contact@lilygo.fr",
          supportPhone: "+33 1 23 45 67 89",
        },
      }),
    })

    if (!response.ok) {
      console.error("[v0] Deletion completed email send failed:", response.statusText)
      throw new Error("Erreur lors de l'envoi de l'email de confirmation de suppression")
    }

    console.log("[v0] Deletion completed email sent successfully")
    return true
  } catch (error) {
    console.error("[v0] Error sending deletion completed email:", error)
    // TODO: Implementer une solution de fallback
    console.log("[v0] Fallback: Email de confirmation de suppression non envoyé")
    return true // Ne pas bloquer le processus
  }
}
