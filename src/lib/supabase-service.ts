import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { exiger } from "./env";

// Client à clé de service : réservé au webhook Stripe et aux tâches programmées.
// Ne jamais l'importer depuis un composant ou une action faite au nom d'une personne.
export function supabaseService(): SupabaseClient {
  return createClient(exiger("SUPABASE_URL"), exiger("SUPABASE_SECRET_KEY"), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
