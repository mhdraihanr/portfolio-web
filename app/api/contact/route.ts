import { NextRequest, NextResponse } from "next/server";
import { sendContactEmail, ContactFormData } from "@/lib/email";
import { z } from "zod";

// Validation schema
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validatedData = contactSchema.parse(body);

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

    // Send email
    await sendContactEmail(validatedData as ContactFormData);

    return NextResponse.json(
      {
        message: "Message sent successfully! I'll get back to you soon.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Contact form error:", error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.issues,
        },
        { status: 400 },
      );
    }

    // Handle other errors
    return NextResponse.json(
      {
        error: "Failed to send message. Please try again later.",
      },
      { status: 500 },
    );
  }
}
