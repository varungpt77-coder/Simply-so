import { db } from "@/db";
import { supportMessages } from "@/db/schema";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) return Response.json({ error: "Invalid request." }, { status: 400 });
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";
    if (name.length < 2 || name.length > 100 || message.length < 10 || message.length > 3000 || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ error: "Please add your name, a valid email, and a message of at least 10 characters." }, { status: 400 });
    }
    await db.insert(supportMessages).values({ name, email, message });
    return Response.json({ message: "Your message has been received." }, { status: 201 });
  } catch (error) {
    if (error instanceof SyntaxError) return Response.json({ error: "Invalid request." }, { status: 400 });
    console.error("Contact message could not be saved", error);
    return Response.json({ error: "We couldn't save your message. Please try again." }, { status: 500 });
  }
}
