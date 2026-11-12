# Recherche du 12 novembre 2026 : marché et open source

Sources du [prompt directeur](prompt-directeur.md).

**Limites à garder en tête.** Les faits ci-dessous ont été lus dans des résultats de recherche, sans ouvrir les pages
en entier. Plusieurs comparatifs sont publiés par des concurrents. Aucun tracker d'issues GitHub n'a pu être lu : les
plaintes viennent d'articles et de blogs. Les étoiles et licences viennent de l'API de recherche de GitHub, le
12 novembre 2026. Ce qui est marqué « supposé » est une déduction, pas une lecture.

## 1. Concurrents vus de France

| Acteur | Prix | Faiblesse relevée | En français | Source |
|---|---|---|---|---|
| Paperless Post | « coins » par destinataire, 25 à 72 $ pour 50 invités | 1,5/5 sur 39 avis Trustpilot, prix jugé opaque, courriers en indésirables | non vérifié | rsvpify.com/top-paperless-post-alternatives, trustpilot.com/review/paperlesspost.com |
| Evite | gratuit avec publicité, Premium vers 14 $ | publicités vues par les invités | non vérifié | capterra.ca, greenvelope.com/resources/best-evite-alternatives |
| Punchbowl | gratuit avec publicité, abonnement vers 7 $ par mois | publicité, abonnement | non vérifié | rsvpify.com |
| Greenvelope | paiement unique dès 19 $ | tourné mariage et entreprise (supposé) | non vérifié | getapp.com |
| Partiful | gratuit | compte et téléphone exigés pour répondre, ton très jeune | non confirmé | blogdumoderateur.com/tools/partiful, party.pro/partiful |
| Apple Invitations | hôte abonné iCloud+ | il faut un iPhone côté hôte | oui | siecledigital.fr, apple.com/fr/newsroom |
| Canva | modèles gratuits | réponses par des applications tierces, pas d'origine | oui | canva.com/fr_fr, canva.com/apps |
| Luma | gratuit, 5 % sur les billets | tourné rencontres et communautés | partiel | luma.com/pricing |
| Dromadaire | cartes virtuelles et faire-part, 4,0 sur 2 220 avis | univers carte de vœux, gestion des réponses non vérifiée | oui | trustpilot.com |
| Joy, WeddyCard | sites de mariage avec réponses | mariage seulement | oui | withjoy.com, mariages.net |

Non trouvés par la recherche, à regarder à la main : Popcarte, Dioton, Zankyou, la fiche française de Partiful.

## 2. Demande et calendrier

- 64 % des Français jugent le réveillon en famille ou entre amis indispensable (ipsos.com/fr-fr/reveillon-cadeaux-traditions-les-fetes-de-fin-dannee-des-francais).
- L'organisation des réceptions est le moment le plus contraignant des fêtes ; 66 % partagent les frais entre hôtes et invités (observatoirecetelem.com, 2019 et 2023).
- Budget de Noël 2025 au plus bas depuis 2017 (lafinancepourtous.com, baromètre Cofidis-CSA) : 9 € doit se justifier.
- Galette des rois : 30 à 32 millions vendues par an, 85 % des Français fêtent l'Épiphanie (planetoscope.com, OpinionWay cité par abcsalles.com).
- 79,3 % des salariés disent que leur entreprise organise un repas ou une soirée de Noël (sondage Deskeo, non vérifié à la source).
- Fêtes de CSE financées par le budget des activités sociales (editions-tissot.fr).
- Pinterest en France : 18 à 19 millions d'utilisateurs, 67 % de femmes (blogdumoderateur.com/chiffres-pinterest).

## 3. Réseaux sociaux

- Partiful : chaque invitation est une page partagée par message ; « les invités deviennent souvent hôtes » ; 2 millions d'utilisateurs ajoutés en 2025 selon l'entreprise. **Aucun taux invité vers hôte n'est publié** (nogood.io/blog/partiful-marketing-strategy, sacra.com, nbcnewyork.com, marketingbrew.com).
- Retour du dîner à la maison et des dîners à thème : sources anglophones grand public, aucune donnée française.
- Pinterest Predicts 2026 : « opéracore », « bal masqué » en hausse de 95 % (woo.paris, parisselectbook.com).
- Comptes français de l'art de recevoir : un seul trouvé (« Waww la table »). Un relevé à la main de vingt comptes reste à faire.
- Publicité Meta en France : coût pour mille vues de 8 à 10 $, clic médian vers 0,53 $ (superads.ai, outil commercial). Pinterest : aucun chiffre fiable.
- Petits créateurs : 25 à 150 € par publication, engagement de 2 à 6 % selon les sources (influee.co, HypeAuditor).

## 4. Projets libres proches

| Projet | Étoiles | Licence | Ce qu'il fait | Ce que l'on en retient |
|---|---|---|---|---|
| lukevella/rallly | 5 359 | AGPL-3.0 | sondage de dates | réponse sans compte |
| HiEventsDev/Hi.Events | 4 169 | AGPL-3.0 avec conditions | billetterie | hors cible |
| pretix/pretix | 2 568 | AGPL-3.0 avec restrictions | boutique de billets | hors cible |
| czue/django-wedding-website | 502 | non déterminée | site de mariage, invités par foyer | le modèle foyer puis invités, lien par foyer |
| lowercasename/gathio | 466 | GPL-3.0 | pages d'événement sans inscription, effacées après 7 jours | lien secret de l'hôte, effacement |
| polaroi8d/cactoide | 397 | AGPL-3.0 | réponses sur mobile, « alternative à Partiful » | reconnaît ne pas empêcher le spam des pages publiques |
| matthewn/seevooplay | 6 | GPL-3.0 | invitations et réponses, façon Evite | page d'invité volontairement minimale |
| joe-cole1/rsvp-to-me | 5 | AGPL-3.0 | réponses auto-hébergées, Next.js | proche de notre pile, minuscule |
| Nishitbaria/openluma | 11 | MIT | clone de Luma | réutilisable, peu de valeur |

Aucun projet trouvé ne réunit une invitation soignée, un lien personnel par invité et un paiement unique.

**Licences.** AGPL et GPL : on ne reprend que des idées, jamais de code. Licence non déterminée (czue) : ne rien
reprendre sans lire le fichier de licence. MIT et Apache : réutilisables, mais ces projets sont trop petits pour valoir
plus qu'une inspiration.
