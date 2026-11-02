import { db } from "@/db";
import { subscribers } from "@/db/schema";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) return Response.json({ error: "Invalid request." }, { status: 400 });
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
      return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
    await db.insert(subscribers).values({ email }).onConflictDoNothing();
    return Response.json({ message: "You're on the list. Welcome to a little more Simply & So." }, { status: 201 });
  } catch (error) {
    if (error instanceof SyntaxError) return Response.json({ error: "Invalid request." }, { status: 400 });
    console.error("Newsletter signup failed", error);
    return Response.json({ error: "We couldn't add you just yet. Please try again." }, { status: 500 });
  }
}
