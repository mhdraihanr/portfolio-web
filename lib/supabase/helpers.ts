import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

export async function insertWorkExperience(
  client: SupabaseClient<Database>,
  data: Database["public"]["Tables"]["work_experience"]["Insert"],
) {
  return await client.from("work_experience").insert([data]);
}

export async function updateWorkExperience(
  client: SupabaseClient<Database>,
  id: string,
  data: Database["public"]["Tables"]["work_experience"]["Update"],
) {
  return await client.from("work_experience").update(data).eq("id", id);
}

export async function insertProject(
  client: SupabaseClient<Database>,
  data: Database["public"]["Tables"]["projects"]["Insert"],
) {
  return await client.from("projects").insert([data]);
}

export async function updateProject(
  client: SupabaseClient<Database>,
  id: string,
  data: Database["public"]["Tables"]["projects"]["Update"],
) {
  return await client.from("projects").update(data).eq("id", id);
}

// ============================================
// SKILLS
// ============================================

export async function insertSkill(
  client: SupabaseClient<Database>,
  data: Database["public"]["Tables"]["skills"]["Insert"],
) {
  return await client.from("skills").insert([data]);
}

export async function updateSkill(
  client: SupabaseClient<Database>,
  id: string,
  data: Database["public"]["Tables"]["skills"]["Update"],
) {
  return await client.from("skills").update(data).eq("id", id);
}

export async function deleteSkill(
  client: SupabaseClient<Database>,
  id: string,
) {
  return await client.from("skills").delete().eq("id", id);
}

// ============================================
// CERTIFICATES
// ============================================

export async function insertCertificate(
  client: SupabaseClient<Database>,
  data: Database["public"]["Tables"]["certificates"]["Insert"],
) {
  return await client.from("certificates").insert([data]);
}

export async function updateCertificate(
  client: SupabaseClient<Database>,
  id: string,
  data: Database["public"]["Tables"]["certificates"]["Update"],
) {
  return await client.from("certificates").update(data).eq("id", id);
}

export async function deleteCertificate(
  client: SupabaseClient<Database>,
  id: string,
) {
  return await client.from("certificates").delete().eq("id", id);
}
