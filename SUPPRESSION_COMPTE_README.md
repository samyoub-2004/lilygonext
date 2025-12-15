# Suppression de Compte et Données - LILYGO

Cette page permet aux utilisateurs de demander la suppression de leurs données personnelles collectées par l'application LILYGO (service de transport VIP premium en France).

## Fonctionnalités

### Page de suppression de compte (`/suppression-compte`)
- Formulaire de demande de suppression avec :
  - Adresse email (obligatoire)
  - Numéro de téléphone (optionnel)
  - Raison de la suppression (optionnel)
  - Case de confirmation obligatoire

### API de traitement (`/api/delete-account`)
- Recherche des réservations associées à l'email/téléphone
- Stockage de la demande de suppression dans Firestore
- Envoi d'email de confirmation
- Retour d'informations sur le nombre de réservations trouvées

## Données collectées par LILYGO

### Données supprimées lors de la demande :
- **Informations personnelles** : nom, prénom, email, téléphone
- **Historique des réservations** : toutes les réservations passées
- **Informations de paiement** : historique des paiements et moyens de paiement

### Données conservées (anonymisées) :
- **Statistiques d'utilisation** : données anonymisées pour amélioration du service
- **Données financières** : conformément aux obligations légales de conservation

## Processus de suppression

1. **Demande** : L'utilisateur soumet le formulaire avec son email
2. **Vérification** : Recherche des réservations associées
3. **Confirmation** : Email de confirmation envoyé à l'utilisateur
4. **Traitement** : Suppression effective des données (sous 30 jours max)
5. **Notification** : Email de confirmation de suppression envoyé

## Base de données

### Collection `reservations`
Stockage des réservations avec les données suivantes :
```javascript
{
  guestInfo: {
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    passengers: string,
    flightNumber: string
  },
  tripType: "simple" | "hourly",
  departure: string,
  destination: string,
  waypoints: string[],
  date: string,
  time: string,
  selectedVehicle: {...},
  selectedOptions: [...],
  paymentMethod: string,
  paymentId: string,
  totalPrice: number,
  status: string,
  createdAt: timestamp
}
```

### Collection `deletion-requests`
Stockage des demandes de suppression :
```javascript
{
  email: string,
  phone: string | null,
  reason: string | null,
  reservationIds: string[],
  status: "pending" | "completed",
  createdAt: timestamp,
  processedAt: timestamp | null,
  processedBy: string | null
}
```

## Configuration requise

### Variables d'environnement
- `NEXT_PUBLIC_FIREBASE_*` : Configuration Firebase
- `NEXT_PUBLIC_SITE_URL` : URL du site pour les emails

### Cloud Functions (optionnel)
Pour l'envoi d'emails automatisés :
- `senddeletionconfirmation` : Confirmation de demande
- `senddeletioncompleted` : Confirmation de suppression effective

## Navigation

La page est accessible via :
- Lien dans le footer : "Suppression de compte"
- URL directe : `/suppression-compte`
- Métadonnées SEO configurées pour éviter l'indexation

## Sécurité et conformité

- **RGPD** : Processus conforme aux exigences européennes
- **Délai de traitement** : Maximum 30 jours comme exigé
- **Double confirmation** : Formulaire + email de confirmation
- **Traçabilité** : Logs de toutes les actions effectuées
- **Non-réversibilité** : Action de suppression définitive

## Support

Pour toute question concernant la suppression de données :
- Email : contact@lilygo.fr
- Téléphone : +33 1 23 45 67 89

## Tests

Pour tester la fonctionnalité :
1. Créer une réservation avec des données personnelles
2. Accéder à `/suppression-compte`
3. Soumettre le formulaire avec l'email utilisé
4. Vérifier la réception de l'email de confirmation
5. Vérifier la création de la demande dans Firestore
