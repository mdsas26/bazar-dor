import { notFound } from "next/navigation";
import {
    getCategories,
    getProductsByCategory,
} from "@/lib/api";
import CategorySort from "../../../components/CategorySort";

type Category = {
    id?: string | number;
    slug?: string;
    nameBn?: string;
    name?: string;
    icon?: string;
    categoryIcon?: string;
};

type CategoryPageProps = {
    params: Promise<{ slug: string }>;
};

export default async function CategoryPage({
    params,
}: CategoryPageProps) {
    const { slug } = await params;

    const [categories, products] = await Promise.all([
        getCategories(),
        getProductsByCategory(slug),
    ]);

    const category = (categories as Category[]).find(
        (item) =>
            item.slug === slug ||
            String(item.id) === slug
    );

    if (!category || products.length === 0) {
        notFound();
    }

    return (
        <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">

            {/* Category Header */}
            <section className="mb-10 flex items-center gap-4 rounded-[20px] border border-[#dce5dd] bg-[#fbfdfb] p-5 sm:p-6">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center text-4xl">
                    {category.icon ?? category.categoryIcon ?? "🛒"}
                </div>

                <div>
                    <h1 className="text-2xl font-extrabold text-[#202a22] sm:text-3xl">
                        {category.nameBn ?? category.name ?? slug}
                    </h1>

                    <p className="mt-1 text-sm text-gray-500 sm:text-base">
                        {new Intl.NumberFormat("bn-BD").format(products.length)}
                        টি পণ্যের আজকের দাম ও পরিবর্তন
                    </p>
                </div>
            </section>

            {/* Sorting + Product Grid */}
            <CategorySort products={products} />

        </main>
    );
}