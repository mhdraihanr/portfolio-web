import ImageKit from "@imagekit/nodejs";
import { NextResponse } from "next/server";

const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
});

export async function GET() {
  try {
    const authParams = imagekit.helper.getAuthenticationParameters();

    return NextResponse.json({
      ...authParams,
      publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
    });
  } catch (error) {
    console.error("ImageKit auth error:", error);
    return NextResponse.json(
      { error: "Failed to generate auth parameters" },
      { status: 500 },
    );
  }
}
