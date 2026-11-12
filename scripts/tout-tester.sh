#!/usr/bin/env bash
# Lance tout : base locale remise à zéro, vérifications, construction, serveur, tests.
# Usage : npm test
set -euo pipefail
cd "$(dirname "$0")/.."

CONTENEURS_INUTILES=studio,imgproxy,storage-api,realtime,edge-runtime,logflare,vector,postgres-meta,supavisor
PORT=3100

npx supabase start -x "$CONTENEURS_INUTILES" >/dev/null
npx supabase db reset >/dev/null
eval "$(npx supabase status -o env 2>/dev/null | grep -E '^(API_URL|SECRET_KEY|PUBLISHABLE_KEY|MAILPIT_URL)=')"

# Valeurs factices, valables pour la base locale seulement.
export SUPABASE_URL="$API_URL" SUPABASE_SECRET_KEY="$SECRET_KEY" SUPABASE_PUBLISHABLE_KEY="$PUBLISHABLE_KEY" MAILPIT_URL
export SITE_URL="http://127.0.0.1:$PORT"
export STRIPE_SECRET_KEY=sk_test_factice STRIPE_WEBHOOK_SECRET=whsec_test_local
export CRON_SECRET=secret-de-tache-local JETON_SECRET=secret-de-jeton-local-pour-les-tests
export SMTP_HOST=127.0.0.1 SMTP_PORT=54325 EMAIL_EXPEDITEUR='Château Nerval <invitations@exemple.test>'
export DATE_OUVERTURE="1er décembre 2026" EMAIL_CONTACT=contact@exemple.test

npm run lint
npx tsc --noEmit
npx next build >/dev/null

if curl -s -o /dev/null "$SITE_URL/"; then
  echo "Le port $PORT est déjà pris : arrêter l'ancien serveur avant de lancer les tests." >&2
  exit 1
fi
npx next start -p "$PORT" >/dev/null 2>&1 &
SERVEUR=$!
trap 'kill $SERVEUR 2>/dev/null || true' EXIT
for _ in $(seq 1 40); do
  curl -sf -o /dev/null "$SITE_URL/" && break
  sleep 0.5
done

npx vitest run "$@"
