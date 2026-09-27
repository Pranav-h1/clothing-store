import {
  CollectionsGrid,
  Hero,
  MaterialsSection,
  NewsletterSection,
  PromoBanner,
  ServiceSection,
  StoryPreview,
} from "@/components/home/sections";
import { ProductRail } from "@/components/product/product-rail";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProductRail eyebrow="Just landed" title="New arrivals" filter="new" href="/shop?filter=new" excludeFeatured />
      <CollectionsGrid />
      <ProductRail eyebrow="Editor's picks" title="Featured pieces" filter="featured" href="/shop" limit={8} />
      <PromoBanner />
      <ProductRail
        eyebrow="Loved by customers"
        title="Best sellers"
        filter="bestsellers"
        href="/shop?filter=bestsellers"
        excludeFeatured
      />
      <StoryPreview />
      <MaterialsSection />
      <ServiceSection />
      <NewsletterSection />
    </>
  );
}
