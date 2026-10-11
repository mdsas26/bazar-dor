import Link from "next/link";
import type { ProductDetails } from "@/types/product";
import ProductCard from "@/components/ProductCard";

type ProductSectionsProps = {
    products: ProductDetails[];
};

export default function ProductSections({
    products,
}: ProductSectionsProps) {
    const risers = products
        .filter((product) => product.change.dir === "up")
        .sort((a, b) => b.change.pct - a.change.pct)
        .slice(0, 6);

    const fallers = products
        .filter((product) => product.change.dir === "down")
        .sort((a, b) => a.change.pct - b.change.pct)
        .slice(0, 6);

    return (
        <div className="mx-auto max-w-6xl space-y-10 px-4 py-8 sm:px-6 sm:py-10">
            {/* Section A: Rising prices */}
            <section>
                <h2 className="mb-5 flex items-center gap-2 text-xl font-extrabold text-[#202a22] sm:text-2xl">
                    <span className="text-red-500">▲</span>
                    আজ দাম বেড়েছে
                </h2>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {risers.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                        />
                    ))}
                </div>
            </section>

            {/* Section B: Falling prices */}
            <section>
                <h2 className="mb-5 flex items-center gap-2 text-xl font-extrabold text-[#202a22] sm:text-2xl">
                    <span className="text-green-600">▼</span>
                    আজ দাম কমেছে
                </h2>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {fallers.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                        />
                    ))}
                </div>
            </section>

            {/* Section C: All products */}
            <section id="সব-পণ্য" className="scroll-mt-6">
                <div className="mb-5">
                    <h2 className="text-xl font-extrabold text-[#202a22] sm:text-2xl">
                        সব পণ্য
                    </h2>

                    <p className="mt-2 text-sm text-gray-600 sm:text-base">
                        মোট {new Intl.NumberFormat("bn-BD").format(products.length)}টি পণ্য দেখানো হচ্ছে
                    </p>
                </div>

                {products.length === 0 ? (
                    <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
                        <p className="text-gray-600">
                            কোনো পণ্য পাওয়া যায়নি।
                        </p>

                        <Link
                            href="/"
                            className="mt-4 inline-block rounded-lg bg-green-700 px-5 py-2 text-white hover:bg-green-800"
                        >
                            আবার চেষ্টা করুন
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                            />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}