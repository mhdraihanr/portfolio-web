import { NextRequest, NextResponse } from "next/server";
import { sendContactEmail, ContactFormData } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

const FIELD_MESSAGES: Record<string, string> = {
  name: "Name must be at least 2 characters.",
  email: "Invalid email address.",
  subject: "Subject must be at least 5 characters.",
  message: "Message must be at least 10 characters.",
};

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";

  const rl = rateLimit(`contact:${ip}`, 3, 60_000);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many requests. Try again later." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  if (typeof (body as any)?.website === "string" && (body as any).website.length > 0) {
    return NextResponse.json({ message: "Message sent successfully! I'll get back to you soon." });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    const fields = [...new Set(parsed.error.issues.map((i) => String(i.path[0])))];
    return NextResponse.json(
      {
        error: "Validation failed",
        fields: Object.fromEntries(
          fields.filter((f) => f in FIELD_MESSAGES).map((f) => [f, FIELD_MESSAGES[f]])
        ),
      },
      { status: 400 }
    );
  }

  try {
    const validatedData = parsed.data;

    // Check if email is configured
    if (
      !process.env.EMAIL_HOST ||
      !process.env.EMAIL_USER ||
      !process.env.EMAIL_PASSWORD ||
      !process.env.EMAIL_TO
    ) {
      console.error("Email service not configured");
      return NextResponse.json(
        {
          error:
            "Email service is not configured. Please contact the administrator.",
        },
        { status: 503 },
      );
    }

    if (
      !process.env.EMAIL_HOST ||
      !process.env.EMAIL_USER ||
      !process.env.EMAIL_PASSWORD ||
      !process.env.EMAIL_TO
    ) {
      console.error("Email service not configured");
      return NextResponse.json(
        {
          error:
            "Email service is not configured. Please contact the administrator.",
        },
        { status: 503 }
      );
    }

    await sendContactEmail(validatedData as ContactFormData);

    return NextResponse.json(
      {
        message: "Message sent successfully! I'll get back to you soon.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      {
        error: "Failed to send message. Please try again later.",
      },
      { status: 500 }
    );
  }
}
