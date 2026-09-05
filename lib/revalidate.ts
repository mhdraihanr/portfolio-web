/**
 * Helper to trigger on-demand cache revalidation after CRUD updates in studio
 */
export async function triggerRevalidate(tag?: string, path?: string) {
  try {
    await fetch("/api/revalidate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tag, path }),
    });
  } catch (error) {
    console.error("Revalidation trigger failed:", error);
  }
}
