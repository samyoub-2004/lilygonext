import type { NextRequest } from "next/server"
import { db } from "../../../lib/firebase"
import { collection, query, where, getDocs, deleteDoc, doc, addDoc, serverTimestamp, updateDoc } from "firebase/firestore"
import { CONTACT_EMAIL } from "../../../lib/seo"
// Version simple qui fonctionne sans cloud functions
import { sendDeletionRequestConfirmation } from "../../../lib/send-deletion-emails-simple"
// TODO: Pour utiliser les cloud functions, décommentez la ligne ci-dessous et commentez la ligne du dessus
// import { sendDeletionRequestConfirmation } from "../../../lib/send-deletion-emails"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, phone, reason } = body

    if (!email) {
      return Response.json(
        { error: "L'adresse email est requise" },
        { status: 400 }
      )
    }

    // Rechercher les réservations avec cet email
    const reservationsCollection = collection(db, "reservations")
    let emailQuery = query(reservationsCollection, where("guestInfo.email", "==", email))
    let phoneQuery = phone ? query(reservationsCollection, where("guestInfo.phone", "==", phone)) : null

    const [emailSnapshot, phoneSnapshot] = await Promise.all([
      getDocs(emailQuery),
      phoneQuery ? getDocs(phoneQuery) : Promise.resolve({ docs: [] })
    ])

    const allDocs = [...emailSnapshot.docs, ...phoneSnapshot.docs]
    const uniqueDocs = allDocs.filter((doc, index, self) =>
      index === self.findIndex(d => d.id === doc.id)
    )

    if (uniqueDocs.length === 0) {
      return Response.json(
        {
          error: "Aucune réservation trouvée avec ces informations. Vérifiez votre email et téléphone."
        },
        { status: 404 }
      )
    }

    // Stocker la demande de suppression
    const deletionRequestsCollection = collection(db, "deletion-requests")

    const deletionRequest = {
      email,
      phone: phone || null,
      reason: reason || null,
      reservationIds: uniqueDocs.map(doc => doc.id),
      status: "pending",
      createdAt: serverTimestamp(),
      processedAt: null,
      processedBy: null,
    }

    const deletionDocRef = await addDoc(deletionRequestsCollection, deletionRequest)

    // Envoyer l'email de confirmation
    try {
      await sendDeletionRequestConfirmation(email, deletionDocRef.id, uniqueDocs.length)
    } catch (emailError) {
      console.error("Erreur lors de l'envoi de l'email de confirmation:", emailError)
      // Ne pas bloquer le processus si l'email échoue
    }

    return Response.json({
      success: true,
      message: "Demande de suppression reçue avec succès",
      requestId: deletionDocRef.id,
      reservationsFound: uniqueDocs.length
    })

  } catch (error) {
    console.error("Erreur lors du traitement de la demande de suppression:", error)

    return Response.json(
      {
        error: "Erreur interne du serveur. Veuillez réessayer plus tard ou nous contacter directement."
      },
      { status: 500 }
    )
  }
}

// Fonction utilitaire pour traiter les demandes de suppression (à exécuter manuellement ou via cron)
// Cette fonction devrait être appelée par un administrateur ou un processus automatisé
export async function processDeletionRequest(requestId: string) {
  try {
    const deletionRequestsCollection = collection(db, "deletion-requests")
    const reservationsCollection = collection(db, "reservations")

    // Récupérer la demande de suppression
    const requestDoc = await getDocs(query(deletionRequestsCollection, where("__name__", "==", requestId)))
    if (requestDoc.empty) {
      throw new Error("Demande de suppression non trouvée")
    }

    const requestData = requestDoc.docs[0].data()
    const reservationIds = requestData.reservationIds

    // Supprimer les réservations
    const deletePromises = reservationIds.map(async (reservationId: string) => {
      const reservationRef = doc(reservationsCollection, reservationId)
      await deleteDoc(reservationRef)
    })

    await Promise.all(deletePromises)

    // Marquer la demande comme traitée
    const requestRef = doc(deletionRequestsCollection, requestId)
    await updateDoc(requestRef, {
      status: "completed",
      processedAt: serverTimestamp(),
      processedBy: "system" // ou l'ID de l'administrateur qui traite
    })

    // TODO: Envoyer un email de confirmation de suppression
    // await sendDeletionConfirmationEmail(requestData.email, requestId)

    return { success: true, deletedReservations: reservationIds.length }

  } catch (error) {
    console.error("Erreur lors du traitement de la demande de suppression:", error)
    throw error
  }
}
