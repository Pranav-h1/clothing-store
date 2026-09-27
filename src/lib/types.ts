export type ImageAsset = {
  src: string;
  alt: string;
};

export type ProductColor = {
  name: string;
  /** CSS colour used for the swatch. */
  hex: string;
};

export type Audience = "women" | "men" | "unisex";

export type Product = {
  id: string;
  /** URL segment, unique across the catalog. */
  slug: string;
  sku: string;
  name: string;
  description: string;
  /** Short bullet highlights shown on the product page. */
  highlights: string[];
  /** Category slug — must match a `Category.slug`. */
  category: string;
  audience: Audience;
  price: number;
  /** Previous price; shown struck through when higher than `price`. */
  compareAtPrice: number | null;
  images: ImageAsset[];
  sizes: string[];
  colors: ProductColor[];
  /** Units on hand per size. A size missing from this map counts as 0. */
  stock: Record<string, number>;
  material: string;
  care: string[];
  featured: boolean;
  isNew: boolean;
  bestseller: boolean;
  /** ISO date — used for "newest" sorting. */
  createdAt: string;
};

export type Category = {
  slug: string;
  name: string;
  description: string;
  image: ImageAsset;
};

export type CartLine = {
  /** Stable key: product id + size + colour. */
  key: string;
  productId: string;
  size: string;
  color: string;
  quantity: number;
};

export type Address = {
  fullName: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
};

export type OrderStatus = "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled";

export type OrderItem = {
  productId: string;
  name: string;
  image: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
};

export type Order = {
  id: string;
  createdAt: string;
  status: OrderStatus;
  customer: { name: string; email: string; phone: string };
  shippingAddress: Address;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  payment: {
    provider: "razorpay";
    /** "demo" = simulated in the browser; "test"/"live" = real Razorpay mode. */
    mode: "demo" | "test" | "live";
    gatewayOrderId?: string;
    paymentId?: string;
  };
  note?: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinedAt: string;
};
