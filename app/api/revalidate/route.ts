import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { tag, path } = await request.json().catch(() => ({}));

    if (tag) {
      revalidateTag(tag, "max");
    }
    if (path) {
      revalidatePath(path);
    }

    // Default revalidate homepage caches
    revalidatePath("/");
    revalidatePath("/projects");
    revalidateTag("homepage-profile", "max");
    revalidateTag("homepage-skills", "max");
    revalidateTag("homepage-projects", "max");
    revalidateTag("homepage-experience", "max");
    revalidateTag("homepage-certificates", "max");
    // Project detail pages cache with tags [`project-<slug>`, "all-projects"].
    // "all-projects" is shared by every detail page, so revalidating it once
    // refreshes all project slugs (and the /projects listing).
    revalidateTag("all-projects", "max");

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to revalidate", details: String(error) },
      { status: 500 },
    );
  }
}
