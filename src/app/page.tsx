import { Suspense } from "react";
import Hero from "@/components/Hero";
import ProductSections from "@/components/ProductSections";
import { getProducts } from "@/lib/api";

async function ProductsContent() {
    const products = await getProducts();

    return <ProductSections products={products} />;
}

export default function HomePage() {
    return (
        <main>
            <Hero />

            <Suspense
                fallback={
                    <div className="py-10 text-center text-gray-500">
                        পণ্যের তথ্য লোড হচ্ছে...
                    </div>
                }
            >
                <ProductsContent />
            </Suspense>
        </main>
    );
}