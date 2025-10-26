/**
 * VERSION ALTERNATIVE SANS CLOUD FUNCTIONS
 * Cette version fonctionne même si les cloud functions d'envoi d'email n'existent pas encore
 */

export async function sendDeletionRequestConfirmation(
  email: string,
  requestId: string,
  reservationsCount: number
) {
  // Version simple qui fonctionne sans cloud functions
  console.log(`[DELETION REQUEST] Email: ${email}, Request ID: ${requestId}, Reservations: ${reservationsCount}`)

  // Simulation d'envoi d'email (à remplacer par une vraie solution d'emailing)
  console.log(`
    📧 EMAIL DE CONFIRMATION SIMULÉ:

    À: ${email}
    Sujet: Confirmation de votre demande de suppression de données - LILYGO

    Bonjour,

    Nous confirmons la réception de votre demande de suppression de données (ID: ${requestId}).

    Nombre de réservations trouvées: ${reservationsCount}

    Votre demande sera traitée sous 30 jours maximum comme l'exige la réglementation RGPD.

    Cordialement,
    L'équipe LILYGO
  `)

  return true // Succès simulé
}

export async function sendDeletionCompletedNotification(
  email: string,
  requestId: string,
  deletedReservationsCount: number
) {
  // Version simple qui fonctionne sans cloud functions
  console.log(`[DELETION COMPLETED] Email: ${email}, Request ID: ${requestId}, Deleted: ${deletedReservationsCount}`)

  // Simulation d'envoi d'email (à remplacer par une vraie solution d'emailing)
  console.log(`
    📧 EMAIL DE SUPPRESSION SIMULÉ:

    À: ${email}
    Sujet: Suppression de vos données effectuée - LILYGO

    Bonjour,

    Vos données ont été supprimées avec succès (ID de demande: ${requestId}).

    Nombre de réservations supprimées: ${deletedReservationsCount}

    Cordialement,
    L'équipe LILYGO
  `)

  return true // Succès simulé
}
