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
    revalidateTag("homepage-skills", "max");
    revalidateTag("homepage-projects", "max");
    revalidateTag("homepage-experience", "max");

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to revalidate", details: String(error) },
      { status: 500 },
    );
  }
}
