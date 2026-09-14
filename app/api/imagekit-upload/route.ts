import ImageKit from "@imagekit/nodejs";
import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth";

const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
});

const PORTFOLIO_FOLDER = "/portfolio";
const MAX_FILE_BYTES = 5 * 1024 * 1024;

// ImageKit's own `checks` parameter enforces these before the bytes are stored,
// and it is still the only layer that reads the real decoded format. Reject on
// its failure and nothing reaches the media library.
const UPLOAD_CHECKS = '"file.mime" : image AND "file.size" <= 5242880';

// The frontend `accept="image/*"` attribute is a convenience, not a control, so
// the format is verified here from the file's magic bytes. Comparing the
// declared Content-Type alone would let a renamed script pass through.
const SIGNATURES: ReadonlyArray<{
  mime: string;
  matches: (bytes: Uint8Array) => boolean;
}> = [
  {
    mime: "image/jpeg",
    matches: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  },
  {
    mime: "image/png",
    matches: (b) =>
      b[0] === 0x89 &&
      b[1] === 0x50 &&
      b[2] === 0x4e &&
      b[3] === 0x47 &&
      b[4] === 0x0d &&
      b[5] === 0x0a &&
      b[6] === 0x1a &&
      b[7] === 0x0a,
  },
  {
    mime: "image/webp",
    matches: (b) =>
      b[0] === 0x52 &&
      b[1] === 0x49 &&
      b[2] === 0x46 &&
      b[3] === 0x46 &&
      b[8] === 0x57 &&
      b[9] === 0x45 &&
      b[10] === 0x42 &&
      b[11] === 0x50,
  },
  {
    mime: "image/avif",
    // ISO-BMFF: 4-byte box size, "ftyp", then the brand at offset 8.
    matches: (b) =>
      b[4] === 0x66 &&
      b[5] === 0x74 &&
      b[6] === 0x79 &&
      b[7] === 0x70 &&
      String.fromCharCode(b[8], b[9], b[10], b[11]) === "avif",
  },
];

function detectImageMime(bytes: Uint8Array): string | null {
  return SIGNATURES.find(({ matches }) => matches(bytes))?.mime ?? null;
}

export async function POST(request: NextRequest) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "file is required" }, { status: 400 });
    }

    if (file.size === 0) {
      return NextResponse.json({ error: "File is empty" }, { status: 400 });
    }

    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json(
        { error: "File exceeds the 5MB limit" },
        { status: 413 },
      );
    }

    const header = new Uint8Array(await file.slice(0, 16).arrayBuffer());
    const detectedMime = detectImageMime(header);

    if (!detectedMime) {
      return NextResponse.json(
        { error: "Only JPEG, PNG, WebP, or AVIF images are allowed" },
        { status: 415 },
      );
    }

    // Uploading under the private key keeps the credentials server-side; the
    // browser never receives a signature it could reuse against another folder.
    const uploaded = await imagekit.files.upload({
      file,
      fileName: file.name,
      folder: PORTFOLIO_FOLDER,
      checks: UPLOAD_CHECKS,
    });

    return NextResponse.json({
      url: uploaded.url,
      fileId: uploaded.fileId,
      filePath: uploaded.filePath,
      mime: detectedMime,
    });
  } catch (error) {
    console.error("ImageKit upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
