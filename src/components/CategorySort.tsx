"use client";

import { useMemo, useState } from "react";
import type { ProductDetails } from "@/types/product";
import ProductCard from "@/components/ProductCard";

type CategorySortProps = {
    products: ProductDetails[];
};

export default function CategorySort({
    products,
}: CategorySortProps) {
    const [sort, setSort] = useState("default");

    const sortedProducts = useMemo(() => {
        const result = [...products];

        if (sort === "low-high") {
            result.sort((a, b) => a.today - b.today);
        } else if (sort === "high-low") {
            result.sort((a, b) => b.today - a.today);
        }

        return result;
    }, [products, sort]);

    return (
        <section>
            {/* Sorting Dropdown */}
            <div className="mb-6 flex justify-end rounded-[20px] border border-[#dce5dd] bg-[#fbfdfb] p-4 sm:p-5">
                <div className="flex items-center gap-3">
                    <label
                        htmlFor="product-sort"
                        className="text-sm text-gray-500 sm:text-base"
                    >
                        সাজান
                    </label>

                    <select
                        id="product-sort"
                        value={sort}
                        onChange={(event) => setSort(event.target.value)}
                        className="max-w-full cursor-pointer rounded-xl border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-800 outline-none focus:border-green-600 sm:text-base"
                    >
                        <option value="default">ডিফল্ট</option>
                        <option value="low-high">দাম: কম থেকে বেশি</option>
                        <option value="high-low">দাম: বেশি থেকে কম</option>
                    </select>
                </div>
            </div>

            {/* Product Count */}
            <p className="mb-6 text-sm text-gray-600 sm:text-base">
                মোট {new Intl.NumberFormat("bn-BD").format(products.length)}
                টি পণ্য দেখানো হচ্ছে
            </p>

            {/* Product Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {sortedProducts.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                    />
                ))}
            </div>
        </section>
    );
}