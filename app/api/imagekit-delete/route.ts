import ImageKit from "@imagekit/nodejs";
import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth";

const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
});

const PORTFOLIO_FOLDER = "/portfolio";

export async function POST(request: NextRequest) {
  // Deleting is destructive and irreversible on ImageKit's side, and fileId is
  // just an identifier, not a capability. Unauthenticated access here would let
  // anyone wipe the portfolio's media.
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { fileId } = await request.json();

    if (!fileId || typeof fileId !== "string") {
      return NextResponse.json(
        { error: "fileId is required" },
        { status: 400 },
      );
    }

    // A logged-in session should not be able to reach files outside the
    // portfolio media folder, so the stored path decides whether this delete is
    // in scope rather than the caller's word for it.
    let existing;
    try {
      existing = await imagekit.files.get(fileId);
    } catch {
      // The file can be removed straight from the ImageKit dashboard, which
      // leaves the database row pointing at nothing. Treat that as already
      // done so the stale record can still be cleaned up instead of blocking
      // the delete forever.
      return NextResponse.json({ success: true, alreadyDeleted: true });
    }

    const filePath = existing.filePath ?? "";

    if (
      filePath !== PORTFOLIO_FOLDER &&
      !filePath.startsWith(`${PORTFOLIO_FOLDER}/`)
    ) {
      return NextResponse.json(
        { error: "File is outside the portfolio folder" },
        { status: 403 },
      );
    }

    await imagekit.files.delete(fileId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ImageKit delete error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? `ImageKit menolak permintaan: ${error.message}`
            : "Failed to delete file",
      },
      { status: 500 },
    );
  }
}
