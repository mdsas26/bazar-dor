import Link from "next/link";

export default function NotFound() {
    return (
        <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
            <h1 className="text-7xl font-extrabold text-green-700">
                404
            </h1>

            <h2 className="mt-4 text-2xl font-bold text-gray-900">
                দুঃখিত! পেজটি খুঁজে পাওয়া যায়নি
            </h2>

            <p className="mt-3 text-gray-600">
                আপনি যে পেজটি খুঁজছেন, সেটি পাওয়া যাচ্ছে না।
            </p>

            <Link
                href="/"
                className="mt-6 rounded-lg bg-green-700 px-6 py-3 font-semibold text-white transition hover:bg-green-800"
            >
                হোম পেজে ফিরে যান
            </Link>
        </main>
    );
}