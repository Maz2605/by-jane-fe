import { ProductForm } from "@/components/admin/products/product-form";
import { MOCK_PRODUCTS } from "@/lib/mock-data/products";
import { notFound } from "next/navigation";

interface EditProductPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
    const { id } = await params;

    // Simulated API call to get product by ID
    const product = MOCK_PRODUCTS.find((p) => p.id === id);

    if (!product) {
        notFound();
    }

    return (
        <div className="flex-1 space-y-4">
            <ProductForm initialData={product} />
        </div>
    );
}
