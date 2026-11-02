export const colors = {
  merlot: { name: "Merlot", hex: "#5d1a2b", image: "/images/bottle-merlot.jpg" },
  ivory: { name: "Porcelain Ivory", hex: "#e2d7c2", image: "/images/bottle-ivory.jpg" },
  rose: { name: "Dusty Rose", hex: "#c2948d", image: "/images/bottle-rose.jpg" },
} as const;

export type ColorKey = keyof typeof colors;
export type Product = {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  capacity: number;
  price: number;
  compareAt: number;
  category: string;
  defaultColor: ColorKey;
  badge: string | null;
  inventory: number;
  sortOrder: number;
};

export const catalog: Product[] = [
  { id: "everyday", name: "The Everyday", subtitle: "Your everyday essential.", description: "From your first meeting to your evening unwind. Our signature bottle brings thoughtful design and perfectly chilled sips to whatever your day holds.", capacity: 750, price: 1499, compareAt: 1899, category: "Everyday", defaultColor: "merlot", badge: "BESTSELLER", inventory: 100, sortOrder: 1 },
  { id: "daybreak", name: "The Daybreak", subtitle: "A lighter way to start.", description: "A little lighter, just as capable. The Daybreak slips effortlessly into your tote, ready for slow mornings, coffee runs, and all the good in between.", capacity: 500, price: 1299, compareAt: 1599, category: "Everyday", defaultColor: "ivory", badge: null, inventory: 100, sortOrder: 2 },
  { id: "nomad", name: "The Nomad", subtitle: "Made for the long way home.", description: "More water. More possibilities. With a generous one-litre capacity and an easy-carry handle, The Nomad is made for longer trails and bigger adventures.", capacity: 1000, price: 1899, compareAt: 2299, category: "On the move", defaultColor: "rose", badge: "ADVENTURE READY", inventory: 100, sortOrder: 3 },
];

export type CartItem = { productId: string; color: ColorKey; quantity: number };
export const formatPrice = (amount: number) => `₹${amount.toLocaleString("en-IN")}`;
export const formatCapacity = (capacity: number) => capacity === 1000 ? "1 L" : `${capacity} ml`;
