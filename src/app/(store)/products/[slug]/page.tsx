import type { Metadata } from "next";
import { ProductDetail } from "@/components/product/product-detail";
import { business } from "@/config/business";
import { baseProducts } from "@/data/catalog";
import { totalStock } from "@/lib/catalog";

export function generateStaticParams() {
  return baseProducts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = baseProducts.find((p) => p.slug === slug);
  if (!product) return { title: "Product" };
  const image = product.images[0];
  const imageUrl = image.src.includes("images.unsplash.com") ? `${image.src}&w=1200&q=75` : image.src;
  return {
    title: product.name,
    description: product.description,
    openGraph: { images: [{ url: imageUrl, alt: image.alt }] },
  };
}

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  // Products created in the demo admin exist only in the browser, so the
  // client component resolves the product; the server adds SEO data when it can.
  const product = baseProducts.find((p) => p.slug === slug);
  const jsonLd = product && {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.sku,
    image: product.images.map((i) => i.src),
    material: product.material,
    brand: { "@type": "Brand", name: business.brand.name },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: business.currency.code,
      availability: totalStock(product) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      )}
      <ProductDetail slug={slug} />
    </>
  );
}
