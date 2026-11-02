import { randomUUID } from "node:crypto";
import { db } from "@/db";
import { orderItems, orders, products } from "@/db/schema";
import { colors, type CartItem } from "@/lib/catalog";
import { getProducts } from "@/lib/products";
import { eq, inArray, sql } from "drizzle-orm";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) return Response.json({ error: "Invalid request." }, { status: 400 });
    const fields = ["customerName", "email", "phone", "address", "city", "state", "postalCode"] as const;
    const customer = {} as Record<typeof fields[number], string>;
    for (const field of fields) {
      if (typeof body[field] !== "string" || !body[field].trim() || body[field].length > 300) {
        return Response.json({ error: "Please complete all delivery details." }, { status: 400 });
      }
      customer[field] = body[field].trim();
    }
    customer.email = customer.email.toLowerCase();
    customer.phone = customer.phone.replace(/[\s-]/g, "");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email) || customer.email.length > 254) {
      return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
    if (!/^(?:\+91)?[6-9]\d{9}$/.test(customer.phone) || !/^[1-9]\d{5}$/.test(customer.postalCode)) {
      return Response.json({ error: "Please enter a valid Indian mobile number and 6-digit PIN code." }, { status: 400 });
    }
    if (!Array.isArray(body.items) || body.items.length < 1 || body.items.length > 20) {
      return Response.json({ error: "Your bag is empty or contains too many items." }, { status: 400 });
    }
    const items: CartItem[] = [];
    for (const item of body.items) {
      if (typeof item.productId !== "string" || !Object.prototype.hasOwnProperty.call(colors, item.color) || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 10) {
        return Response.json({ error: "Please check the products in your bag." }, { status: 400 });
      }
      const existing = items.find((entry) => entry.productId === item.productId && entry.color === item.color);
      if (existing) {
        existing.quantity += item.quantity;
        if (existing.quantity > 10) return Response.json({ error: "A maximum of 10 bottles per colour is allowed." }, { status: 400 });
      } else items.push({ productId: item.productId, color: item.color, quantity: item.quantity });
    }
    await getProducts();
    const result = await db.transaction(async (tx) => {
      const ids = [...new Set(items.map((item) => item.productId))];
      const available = await tx.select().from(products).where(inArray(products.id, ids)).orderBy(products.id).for("update");
      if (available.length !== ids.length) throw new Error("STOCK:One of these bottles is no longer available. Please refresh your bag.");
      for (const product of available) {
        const quantity = items.filter((item) => item.productId === product.id).reduce((sum, item) => sum + item.quantity, 0);
        if (product.inventory < quantity) throw new Error(`STOCK:Only ${product.inventory} of ${product.name} are currently available.`);
      }
      const subtotal = items.reduce((sum, item) => sum + available.find((product) => product.id === item.productId)!.price * item.quantity, 0);
      const shipping = subtotal >= 999 ? 0 : 79;
      const id = `SAS-${randomUUID().slice(0, 8).toUpperCase()}`;
      await tx.insert(orders).values({ id, ...customer, subtotal, shipping, total: subtotal + shipping, paymentMethod: "cod" });
      await tx.insert(orderItems).values(items.map((item) => {
        const product = available.find((entry) => entry.id === item.productId)!;
        return { orderId: id, productId: product.id, productName: product.name, color: item.color, quantity: item.quantity, price: product.price };
      }));
      for (const product of available) {
        const quantity = items.filter((item) => item.productId === product.id).reduce((sum, item) => sum + item.quantity, 0);
        await tx.update(products).set({ inventory: sql`${products.inventory} - ${quantity}` }).where(eq(products.id, product.id));
      }
      return { orderId: id, total: subtotal + shipping };
    });
    return Response.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof SyntaxError) return Response.json({ error: "Invalid request." }, { status: 400 });
    if (error instanceof Error && error.message.startsWith("STOCK:")) {
      return Response.json({ error: error.message.slice(6) }, { status: 409 });
    }
    console.error("Order could not be created", error);
    return Response.json({ error: "We couldn't save your order. Please try again in a moment." }, { status: 500 });
  }
}
