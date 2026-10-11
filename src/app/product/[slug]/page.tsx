import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getProductBySlug } from "../../../lib/api";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

type PageProps = {
    params: Promise<{
        slug: string;
    }>;
};

const formatPrice = (price: number) =>
    new Intl.NumberFormat("bn-BD", {
        maximumFractionDigits: 2,
    }).format(price);

export default async function ProductDetailsPage({
    params,
}: PageProps) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/sign-up?reason=auth-required");
    }

    const { slug } = await params;

    let product;

    try {
        product = await getProductBySlug(slug);
    } catch {
        notFound();
    }

    const prices = product.markets.flatMap((market) => [
        market.min,
        market.max,
    ]);

    const lowestPrice = Math.min(...prices);
    const highestPrice = Math.max(...prices);

    const averagePrice =
        product.markets.reduce(
            (total, market) =>
                total + (market.min + market.max) / 2,
            0
        ) / product.markets.length;

    const priceChange = product.today - product.yesterday;

    const changeColor =
        product.change.dir === "up"
            ? "text-red-600"
            : product.change.dir === "down"
                ? "text-green-600"
                : "text-gray-500";

    const changeSymbol =
        product.change.dir === "up"
            ? "▲"
            : product.change.dir === "down"
                ? "▼"
                : "●";

    return (
        <main className="mx-auto min-h-screen w-full max-w-[1600px] px-5 py-8 sm:px-8 lg:px-12 xl:px-16">

            {/* Breadcrumb */}
            <nav
                aria-label="Breadcrumb"
                className="mb-8 flex flex-wrap items-center gap-2 text-sm text-gray-600"
            >
                <Link
                    href="/"
                    className="transition hover:text-green-700"
                >
                    হোম
                </Link>

                <span>›</span>

                <Link
                    href={`/category/${product.category}`}
                    className="transition hover:text-green-700"
                >
                    {product.categoryNameBn}
                </Link>

                <span>›</span>

                <span className="font-medium text-gray-900">
                    {product.nameBn}
                </span>
            </nav>

            {/* Product Header */}
            <section className="mb-8 flex flex-col gap-6 rounded-2xl border border-gray-200 bg-white p-5 sm:p-8 md:flex-row md:items-center md:justify-between">

                <div className="flex items-center gap-4 sm:gap-6">

                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-green-50 text-4xl sm:h-24 sm:w-24 sm:text-5xl">
                        {product.image || product.categoryIcon}
                    </div>

                    <div>
                        <p className="mb-1 text-sm text-gray-500">
                            {product.categoryIcon} {product.categoryNameBn}
                        </p>

                        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                            {product.nameBn}
                        </h1>

                        <p className="mt-2 text-sm text-gray-500">
                            প্রতি{" "}
                            {product.unit === "kg"
                                ? "কেজি"
                                : product.unit === "liter" ||
                                    product.unit === "litre"
                                    ? "লিটার"
                                    : product.unit === "dozen"
                                        ? "ডজন"
                                        : "পিস"}
                            {" · "}
                            {product.categoryNameBn}
                        </p>

                        <p className="mt-3 text-sm text-gray-700">
                            গতকালের তুলনায় আজ দাম{" "}
                            <span className="font-semibold">
                                {priceChange > 0
                                    ? `${formatPrice(priceChange)} টাকা বেড়েছে`
                                    : priceChange < 0
                                        ? `${formatPrice(Math.abs(priceChange))} টাকা কমেছে`
                                        : "অপরিবর্তিত রয়েছে"}
                            </span>
                        </p>
                    </div>
                </div>

                {/* Today's Price */}
                <div className="shrink-0 rounded-2xl bg-green-50 px-8 py-5 text-center md:min-w-40">

                    <p className="text-sm text-gray-500">
                        আজকের দাম
                    </p>

                    <p className="my-1 text-4xl font-bold text-gray-900">
                        {formatPrice(product.today)}
                    </p>

                    <p className="text-sm text-gray-500">
                        টাকা / {product.unit === "kg" ? "কেজি" : product.unit}
                    </p>

                    <p className={`mt-2 text-sm font-semibold ${changeColor}`}>
                        {changeSymbol} {formatPrice(product.change.pct)}%
                    </p>
                </div>
            </section>

            {/* Price Summary */}
            <section className="mb-8 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
                <h2 className="mb-6 text-xl font-bold text-gray-900">
                    দামের সারসংক্ষেপ
                </h2>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">

                    {/* Lowest Price */}
                    <div className="rounded-2xl border border-gray-200 p-6 sm:p-7">
                        <p className="text-sm text-gray-700">
                            সর্বনিম্ন দাম
                        </p>

                        <p className="mt-1 text-xl font-bold text-green-600">
                            {formatPrice(
                                Math.min(...product.markets.map((market) => market.min))
                            )} <span className="text-sm font-normal">টাকা</span>
                        </p>

                        <p className="mt-1 text-xs text-gray-600">
                            সবচেয়ে কম দামের বাজার
                        </p>
                    </div>

                    {/* Highest Price */}
                    <div className="rounded-2xl border border-gray-200 p-6 sm:p-7">
                        <p className="text-sm text-gray-700">
                            সর্বাধিক দাম
                        </p>

                        <p className="mt-1 text-xl font-bold text-red-600">
                            {formatPrice(
                                Math.max(...product.markets.map((market) => market.max))
                            )} <span className="text-sm font-normal">টাকা</span>
                        </p>

                        <p className="mt-1 text-xs text-gray-600">
                            সবচেয়ে বেশি দামের বাজার
                        </p>
                    </div>

                    {/* Average Price */}
                    <div className="rounded-2xl border border-gray-200 p-6 sm:p-7">
                        <p className="text-sm text-gray-700">
                            গড় দাম
                        </p>

                        <p className="mt-1 text-xl font-bold text-green-600">
                            {formatPrice(
                                Math.round(
                                    product.markets.reduce(
                                        (total, market) => total + (market.min + market.max) / 2,
                                        0
                                    ) / product.markets.length
                                )
                            )} <span className="text-sm font-normal">টাকা</span>
                        </p>

                        <p className="mt-1 text-xs text-gray-600">
                            প্রতি {product.unit === "kg" ? "কেজি" : product.unit}-এর হিসাবে
                        </p>
                    </div>

                </div>
            </section>

            {/* Market Prices */}
            <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">

                <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                    <h2 className="text-xl font-bold text-gray-900">
                        বাজারভিত্তিক আজকের দাম
                    </h2>

                    <span className="text-sm text-gray-500">
                        মোট {formatPrice(product.markets.length)}টি বাজার
                    </span>
                </div>

                {/* Responsive Table */}
                <div className="overflow-x-auto rounded-xl border border-gray-200">

                    <table className="w-full min-w-[650px] border-collapse text-left text-sm">

                        <thead className="bg-gray-50 text-gray-600">
                            <tr>
                                <th className="px-5 py-5 font-semibold">
                                    বাজার
                                </th>

                                <th className="px-5 py-5 font-semibold">
                                    বিভাগ
                                </th>

                                <th className="px-5 py-5 text-right font-semibold">
                                    সর্বনিম্ন
                                </th>

                                <th className="px-5 py-5 text-right font-semibold">
                                    সর্বাধিক
                                </th>

                                <th className="px-5 py-5 text-right font-semibold">
                                    গড়
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {product.markets.map((market, index) => {

                                const marketAverage =
                                    (market.min + market.max) / 2;

                                return (
                                    <tr
                                        key={`${market.market}-${index}`}
                                        className="border-t border-gray-200 transition hover:bg-green-50"
                                    >
                                        <td className="px-5 py-5 font-medium text-gray-900">
                                            {market.market}
                                        </td>

                                        <td className="px-5 py-5 text-gray-600">
                                            {market.division}
                                        </td>

                                        <td className="px-5 py-5 text-right text-green-700">
                                            {formatPrice(market.min)} টাকা
                                        </td>

                                        <td className="px-5 py-5 text-right text-red-600">
                                            {formatPrice(market.max)} টাকা
                                        </td>

                                        <td className="px-5 py-5 text-right font-semibold text-gray-900">
                                            {formatPrice(marketAverage)} টাকা
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>

                    </table>
                </div>

            </section>

            {/* Back Button */}
            <div className="mt-6">
                <Link
                    href={`/category/${product.category}`}
                    className="inline-flex items-center rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:border-green-600 hover:text-green-700"
                >
                    ← {product.categoryNameBn} ক্যাটাগরিতে ফিরে যান
                </Link>
            </div>

        </main>
    );
}