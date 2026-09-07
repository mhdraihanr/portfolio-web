import { getProfile } from "@/lib/supabase/public-data";
import { HeroClient } from "./hero-client";

export async function Hero() {
  const profile = await getProfile();
  return <HeroClient profile={profile} />;
}
