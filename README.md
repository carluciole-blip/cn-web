# Les invitations de Château Nerval

De belles invitations pour vos réceptions. Vos invités répondent en un geste, vous savez qui vient.

État : jalon J1 en local (page de vente, pages légales, prévente du Carnet des fêtes, webhook Stripe,
file d'attente des e-mails). Rien n'est déployé. Les choix sont dans [DECISIONS.md](DECISIONS.md).

## Tout lancer

```bash
npm install
```

```bash
npm test
```

Cette commande unique démarre le Supabase local (Docker requis), remet la base à zéro avec les migrations,
lance le lint, TypeScript, la construction, le serveur sur le port 3100, puis tous les tests.

Pour développer :

```bash
npm run base:demarrer
```

```bash
cp .env.example .env.local
```

```bash
npm run dev
```

Les e-mails envoyés en local se lisent dans Mailpit : http://127.0.0.1:54324.

## Pile

Next.js 16 (App Router, TypeScript strict), Supabase (Postgres, RLS sur toutes les tables), Stripe Checkout,
Brevo en SMTP, Netlify. Aucune IA, aucun SMS, aucun traceur, aucune police tierce.

## Où sont les choses

| Chemin | Rôle |
|---|---|
| `src/config/maison.ts` | Identité et informations légales, lues dans l'environnement |
| `src/messages/fr.ts`, `src/messages/legal-fr.ts` | Tous les textes (fichier de traduction) |
| `src/lib/offres.ts` | Catalogue et prix, côté serveur seulement |
| `src/app/api/prevente` | Création de la session Stripe Checkout |
| `src/app/api/stripe/webhook` | Webhook Stripe : signature vérifiée, idempotent, journalisé |
| `src/lib/emails/` | File d'attente et contenu des e-mails |
| `src/app/api/taches/emails` | Vidage de la file, appelé par `netlify/functions/vider-file.mts` |
| `supabase/migrations/` et `supabase/retours/` | Migrations numérotées et leurs retours |
| `tests/` | Tests Vitest (unitaires et d'intégration contre le Supabase local) |

## Fonctions Postgres `SECURITY DEFINER`

La liste est tenue ici ; aucune autre n'existe. Toutes sont réservées au rôle de service
(webhook Stripe et tâches programmées) ; le rôle anonyme et les personnes connectées ne peuvent pas les appeler.

| Fonction | Rôle | Contrôle | Test |
|---|---|---|---|
| `traiter_evenement_stripe(id, type, achat)` | Journalise l'événement ; pour un achat, crée l'achat, ses crédits et l'e-mail de confirmation en une transaction | Rôle de service ; clé unique sur l'événement et sur la session | `tests/paiement.test.ts`, `tests/acces.test.ts` |
| `reserver_emails(quota, lot)` | Réserve les prochains e-mails sans dépasser le quota du jour (jour de Paris) | Rôle de service | `tests/file.test.ts`, `tests/acces.test.ts` |
| `marquer_email(id, succes)` | Note le résultat d'un envoi, programme un nouvel essai ou l'échec | Rôle de service | `tests/file.test.ts`, `tests/acces.test.ts` |

## Mise en production (à faire à partir du 16 novembre)

1. Créer le projet Supabase dans une région de l'Union européenne et y appliquer les migrations (`supabase db push`), jamais de SQL collé à la main.
2. Créer le site Netlify et y saisir les variables de `.env.example` avec les vraies valeurs.
3. Stripe : créer le point de terminaison de webhook vers `/api/stripe/webhook` (événement `checkout.session.completed`) et reporter son secret dans `STRIPE_WEBHOOK_SECRET`.
4. Brevo : valider l'expéditeur sur le domaine, configurer SPF, DKIM et DMARC, reporter les identifiants SMTP.
5. Faire un paiement en mode test, puis un vrai achat, et vérifier la ligne dans `purchases` et l'e-mail reçu.
