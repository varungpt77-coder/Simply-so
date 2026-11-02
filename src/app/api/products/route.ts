import { getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return Response.json({ products: await getProducts() });
  } catch {
    return Response.json({ error: "The collection is temporarily unavailable." }, { status: 500 });
  }
}
