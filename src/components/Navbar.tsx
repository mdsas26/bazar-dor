"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getCategories, getProducts } from "@/lib/api";
import type { Category } from "@/lib/api";
import type { ProductDetails } from "@/types/product";
import UserDropdown from "./UserDropdown";
import { useSession } from "@/lib/auth-client";

const banglaNumber = (number: number) =>
    new Intl.NumberFormat("bn-BD", {
        maximumFractionDigits: 2,
    }).format(number);

const unitLabels: Record<string, string> = {
    kg: "কেজি",
    liter: "লিটার",
    litre: "লিটার",
    dozen: "ডজন",
    piece: "পিস",
    pcs: "পিস",
};

function PriceTicker({ products }: { products: ProductDetails[] }) {
    if (products.length === 0) {
        return null;
    }

    const tickerProducts = products;
    const items = [...tickerProducts, ...tickerProducts];

    return (
        <div className="overflow-hidden border-y border-gray-200 bg-white">
            <div className="ticker-track flex w-max">
                {items.map((product, index) => {
                    const { dir, pct } = product.change;

                    return (
                        <Link
                            key={`${product.id}-${index}`}
                            href={`/product/${product.slug}`}
                            className="flex shrink-0 items-center gap-2 border-r border-gray-100 px-5 py-3 text-sm transition-colors hover:bg-green-50 sm:text-base"
                        >
                            <span>{product.image || product.categoryIcon}</span>

                            <span className="whitespace-nowrap font-medium text-gray-800">
                                {product.nameBn}
                            </span>

                            <span className="whitespace-nowrap text-gray-700">
                                {banglaNumber(product.today)} টাকা/
                                {unitLabels[product.unit.toLowerCase()] ??
                                    product.unit}
                            </span>

                            <span
                                className={`whitespace-nowrap font-bold ${dir === "up"
                                    ? "text-red-500"
                                    : dir === "down"
                                        ? "text-green-600"
                                        : "text-gray-500"
                                    }`}
                            >
                                {dir === "up" ? "▲" : dir === "down" ? "▼" : "—"}{" "}
                                {banglaNumber(Math.abs(pct))}%
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

export default function Navbar() {
    const pathname = usePathname();

    const { data: session, isPending } = useSession();
    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<ProductDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [date, setDate] = useState("");

    useEffect(() => {
        setDate(
            new Intl.DateTimeFormat("bn-BD", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
                timeZone: "Asia/Dhaka",
            }).format(new Date())
        );
        async function loadNavbarData() {
            try {
                const [categoryData, productData] = await Promise.all([
                    getCategories(),
                    getProducts(),
                ]);

                setCategories(categoryData);
                setProducts(productData);
            } catch (error) {
                console.error("Failed to load navbar data:", error);
            } finally {
                setLoading(false);
            }
        }

        loadNavbarData();
    }, []);



    return (
        <header className="w-full border-b border-gray-200 bg-[#f9fbf9]">
            {/* Logo and Authentication */}
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
                <Link href="/" className="flex items-center gap-3">
                    <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-green-700">
                        <Image
                            src="/logo-icon.png"
                            alt="বাজার দর"
                            width={36}
                            height={36}
                            className="h-7 w-7 object-contain"
                            priority
                        />
                    </div>

                    <div>
                        <h1 className="text-xl font-extrabold text-gray-900 sm:text-2xl">
                            বাজার দর
                        </h1>

                        <p className="mt-0.5 text-xs text-gray-600 sm:text-sm">
                            {date}
                        </p>
                    </div>
                </Link>

                {/* Authentication */}
                <div className="flex items-center gap-2 sm:gap-3">
                    {isPending ? null : session?.user ? (
                        <UserDropdown user={session.user} />) : (
                        <>
                            <Link
                                href="/sign-in"
                                className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-800 transition hover:bg-gray-100 sm:text-base"
                            >
                                সাইন ইন
                            </Link>

                            <Link
                                href="/sign-up"
                                className="rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-green-800 sm:px-5 sm:text-base"
                            >
                                সাইন আপ
                            </Link>
                        </>
                    )}
                </div>
            </div>

            {/* Dynamic Category Navigation */}
            <nav className="border-y border-gray-200">
                <div className="mx-auto max-w-6xl overflow-x-auto">
                    <div className="flex w-max min-w-full items-center justify-start gap-2 px-4 py-2 sm:gap-4 sm:px-6">
                        {loading ? (
                            <div className="px-3 py-2 text-sm text-gray-500">
                                ক্যাটাগরি লোড হচ্ছে...
                            </div>
                        ) : (
                            categories.map((category) => {
                                const isActive =
                                    pathname === `/category/${category.slug}`;

                                return (
                                    <Link
                                        key={category.id}
                                        href={`/category/${category.slug}`}
                                        className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold transition sm:text-base ${isActive
                                            ? "bg-green-100 text-green-800"
                                            : "text-gray-800 hover:bg-gray-100"
                                            }`}
                                    >
                                        <span>{category.icon}</span>
                                        <span>{category.nameBn}</span>
                                    </Link>
                                );
                            })
                        )}
                    </div>
                </div>
            </nav>

            {/* Dynamic Price Ticker */}
            {!loading && <PriceTicker products={products} />}
        </header >
    );

}
