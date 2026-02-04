import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function getUser() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function requireAuth() {
  const user = await getUser();

  if (!user) {
    const adminRoute = process.env.ADMIN_ROUTE_SECRET || "admin";
    redirect(`/${adminRoute}/login`);
  }

  return user;
}

export async function signIn(email: string, password: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function signOut() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}

export function getAdminRoute() {
  return process.env.ADMIN_ROUTE_SECRET || "admin";
}
