# Décisions

Une ligne par décision prise sans la fondatrice, datée. « Lu » : dans un fichier ou une documentation.
« Mesuré » : par une commande. « Supposé » : à confirmer.

- 2026-11-12 · **Le produit est celui de Château Nerval** (consigne de la fondatrice du 12 novembre, qui lève l'interdit du §14 du cahier des charges). Nom provisoire : « Les invitations de Château Nerval ». Conséquence à trancher par elle : une entreprise existante ne répond sans doute pas à la règle « entreprise neuve » du concours (supposé).
- 2026-11-12 · **Charte** : thème Jour du système de marque (couleurs, Spectral, Hanken Grotesk, filet et point, arche, angles droits, ni ombre ni dégradé), ton de la Maison (vouvoiement, ni tiret long ni point d'exclamation), vérifié par un test. Lu dans le système de marque. Le sceau n'est pas utilisé : ses fichiers ne sont pas dans le dépôt et il ne se redessine pas.
- 2026-11-12 · **Rien n'est déployé ni créé en ligne** avant le 16 novembre : ni site Netlify, ni projet Supabase, ni produit Stripe. Tout tourne en local.
- 2026-11-12 · **Informations manquantes** (domaine, e-mails, date d'ouverture, raison sociale, SIRET, adresse, TVA) : variables d'environnement ; les pages affichent « [à compléter : …] » tant qu'elles manquent.
- 2026-11-12 · **« À TRANCHER » du cahier des charges** : les propositions par défaut sont appliquées en attendant (export CSV dans les deux formules, expiration à la date d'envoi, remboursement au prorata, envois à 10 h heure de Paris).
- 2026-11-12 · **Versions épinglées** : Next.js 16.4.6, React 19.3.0, supabase-js 2.119.0, stripe 23.1.0, nodemailer 10.5.0, CLI Supabase 3.1.0, Vitest 5.1.0 (mesuré : `npm view`). Documentation de Next.js lue dans `node_modules/next/dist/docs`.
- 2026-11-12 · **CSP sans nonce**, avec `'unsafe-inline'` pour les scripts et les styles. Lu : un nonce impose le rendu dynamique de toutes les pages et interdit le pré-rendu (`content-security-policy.md`). La vitesse prime (§10). Écart à signaler : ce n'est pas la CSP « stricte » demandée. Piste pour J24 : l'option expérimentale `sri` de Next.js.
- 2026-11-12 · **Tâches programmées : fonctions programmées de Netlify**, une seule méthode. Elles appellent une route du site protégée par `CRON_SECRET`. Lu (documentation Netlify via le connecteur) : UTC, 30 s au plus, déploiement publié seulement.
- 2026-11-12 · **File des e-mails** : lot de 20 toutes les 5 minutes, 5 essais espacés de 15 minutes de plus à chaque fois, puis « échec ». Un verrou de 10 minutes évite le double envoi ; si l'envoi réussit mais que son marquage échoue, l'e-mail peut repartir une fois après ce délai (risque accepté).
- 2026-11-12 · **Quota Brevo** : 300 par jour par défaut (`EMAIL_QUOTA_JOUR`), supposé, non vérifié : le site de Brevo n'est pas joignable depuis cet environnement.
- 2026-11-12 · **Supabase** : lu dans sa documentation, l'envoi d'e-mails intégré ne sert que les adresses de l'équipe du projet, donc Brevo en SMTP dès le premier jour ; et l'offre gratuite doit exporter elle-même ses données (`supabase db dump`). L'export quotidien chiffré est prévu au jalon J10.
- 2026-11-12 · **Migrations de retour** dans `supabase/retours/`, même nom que la migration : la CLI Supabase n'a pas de migration descendante.
- 2026-11-12 · **Renoncement au droit de rétractation** : case à cocher sur la page, jamais cochée d'avance, vérifiée côté serveur ; l'heure du consentement est gardée avec l'achat. Texte à faire valider.
- 2026-11-12 · **Bouton principal de l'accueil** : tant que l'outil n'est pas ouvert, il mène à la prévente du Carnet et non à « Créer mon invitation », pour ne rien promettre qui n'existe pas encore. À inverser au jalon J5.
- 2026-11-12 · **Session Stripe payée mais inexploitable** (offre inconnue, e-mail absent) : réponse 500 sans journaliser, pour que Stripe réessaie et que l'anomalie reste visible.
- 2026-11-12 · **Test du ton corrigé** : la première version signalait « fêtes » comme un tutoiement (limite de mot mal gérée avec les accents). Le test était faux, il a été corrigé ; aucun texte n'a été modifié pour le faire passer.
