import { pgTable, text, integer, timestamp, serial } from "drizzle-orm/pg-core";

export const products = pgTable("simplyso_products", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  subtitle: text("subtitle").notNull(),
  description: text("description").notNull(),
  capacity: integer("capacity").notNull(),
  price: integer("price").notNull(),
  compareAt: integer("compare_at").notNull(),
  category: text("category").notNull(),
  defaultColor: text("default_color").notNull(),
  badge: text("badge"),
  inventory: integer("inventory").notNull().default(100),
  sortOrder: integer("sort_order").notNull(),
});

export const orders = pgTable("simplyso_orders", {
  id: text("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  postalCode: text("postal_code").notNull(),
  subtotal: integer("subtotal").notNull(),
  shipping: integer("shipping").notNull(),
  total: integer("total").notNull(),
  paymentMethod: text("payment_method").notNull().default("cod"),
  status: text("status").notNull().default("received"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const orderItems = pgTable("simplyso_order_items", {
  id: serial("id").primaryKey(),
  orderId: text("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  productId: text("product_id").notNull().references(() => products.id),
  productName: text("product_name").notNull(),
  color: text("color").notNull(),
  quantity: integer("quantity").notNull(),
  price: integer("price").notNull(),
});

export const supportMessages = pgTable("simplyso_support_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const subscribers = pgTable("simplyso_subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
