"use client";

import { AdminPageHeader } from "@/components/admin/admin-shell";
import { ProductForm } from "@/components/admin/product-form";

export default function NewProductPage() {
  return (
    <>
      <AdminPageHeader title="Add product" description="Create a new product for the store." />
      <ProductForm />
    </>
  );
}
