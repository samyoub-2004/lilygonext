import type { Metadata } from "next"
import AccountDeletionPage from "../../components/account-deletion-page"

export const metadata: Metadata = {
  title: "Suppression de Compte et Données | LILYGO",
  description: "Demandez la suppression de votre compte et de vos données personnelles collectées par LILYGO. Service de transport VIP premium en France.",
  robots: "noindex, nofollow",
}

export default function SuppressionCompte() {
  return <AccountDeletionPage />
}
