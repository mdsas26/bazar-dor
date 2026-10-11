import Link from "next/link";

export default function Footer() {
    return (
        <footer className="border-t border-[#dce5dd] bg-[#fbfdfb]">
            <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-4 py-6 sm:px-6 md:flex-row md:items-center md:gap-6">
                {/* Left */}
                <Link
                    href="/"
                    className="text-sm text-[#354139] transition hover:text-green-700 sm:text-base"
                >
                    বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।
                </Link>

                {/* Right */}
                <p className="text-sm text-[#354139] sm:text-base">
                    সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
                </p>
            </div>
        </footer>
    );
}