import { db } from "@/db";
import { products } from "@/db/schema";
import { asc } from "drizzle-orm";
import { catalog, type Product } from "@/lib/catalog";

export async function getProducts(): Promise<Product[]> {
  await db.insert(products).values(catalog).onConflictDoNothing();
  const rows = await db.select().from(products).orderBy(asc(products.sortOrder));
  return rows as Product[];
}
