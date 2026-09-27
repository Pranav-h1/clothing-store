"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { ProductForm } from "@/components/admin/product-form";
import { ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { EmptyState } from "@/components/ui/misc";
import { useProduct } from "@/lib/stores/catalog";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const product = useProduct(id);

  if (!product) {
    return (
      <EmptyState
        icon="box"
        title="Product not found"
        body="It may have been deleted."
        action={<ButtonLink href="/admin/products">Back to products</ButtonLink>}
      />
    );
  }

  return (
    <>
      <AdminPageHeader
        title="Edit product"
        description={product.name}
        action={
          <Link
            href={`/products/${product.slug}`}
            className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink"
          >
            View in store <Icon name="external" size={15} />
          </Link>
        }
      />
      <ProductForm key={product.id} product={product} />
    </>
  );
}
