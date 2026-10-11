import Link from "next/link";
import type { ProductDetails } from "@/types/product";

type ProductCardProps = {
    product: ProductDetails;
};

const formatNumber = (value: number) =>
    new Intl.NumberFormat("bn-BD", {
        maximumFractionDigits: 2,
    }).format(value);

const unitLabels: Record<string, string> = {
    kg: "প্রতি কেজি",
    liter: "প্রতি লিটার",
    litre: "প্রতি লিটার",
    dozen: "প্রতি ডজন",
    piece: "প্রতি পিস",
    pcs: "প্রতি পিস",
};

export default function ProductCard({ product }: ProductCardProps) {
    const { dir, pct } = product.change;

    const badgeStyle =
        dir === "up"
            ? "bg-red-50 text-red-600"
            : dir === "down"
                ? "bg-green-50 text-green-600"
                : "bg-gray-100 text-gray-700";

    const arrow =
        dir === "up" ? "▲" : dir === "down" ? "▼" : "—";

    const unit =
        unitLabels[product.unit.toLowerCase()] ??
        `প্রতি ${product.unit}`;

    return (
        <Link
            href={`/product/${product.slug}`}
            className="block rounded-[20px] border border-[#dce5dd] bg-[#fbfdfb] p-4 transition hover:-translate-y-0.5 hover:shadow-md sm:p-5"
        >
            <div className="flex items-center gap-4">
                <div className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-2xl bg-[#f0f5f0] text-3xl">
                    {product.image || product.categoryIcon}
                </div>

                <div className="min-w-0">
                    <h3 className="truncate text-lg font-bold text-[#202a22]">
                        {product.nameBn}
                    </h3>

                    <p className="mt-0.5 text-sm text-gray-600">
                        {unit}
                    </p>
                </div>
            </div>

            <div className="mt-4 flex items-end justify-between gap-2">
                <div>
                    <p className="text-sm text-gray-600">
                        আজকের দাম
                    </p>

                    <p className="mt-1 text-xl font-extrabold text-[#202a22]">
                        {formatNumber(product.today)}{" "}
                        <span className="text-base font-medium">টাকা</span>
                    </p>
                </div>

                <span
                    className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-bold ${badgeStyle}`}
                >
                    {arrow} {formatNumber(Math.abs(pct))}%
                </span>
            </div>
        </Link>
    );
}