"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

type UserDropdownProps = {
    user: {
        name: string;
        email: string;
        image?: string | null;
    };
};

export default function UserDropdown({ user }: UserDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSigningOut, setIsSigningOut] = useState(false);

    const router = useRouter();

    const handleSignOut = async () => {
        setIsSigningOut(true);

        try {
            await signOut();
            toast.success("সাইন আউট সফল হয়েছে!");
            router.push("/");
            router.refresh();
        } catch (error) {
            toast.error("সাইন আউট করা যায়নি।");
            console.error("Sign out failed:", error);
        } finally {
            setIsSigningOut(false);
        }
    };

    return (
        <div className="relative">
            {/* Profile Button */}
            <button
                type="button"
                onClick={() => setIsOpen((previous) => !previous)}
                aria-expanded={isOpen}
                aria-label="প্রোফাইল মেনু"
                className="flex items-center gap-2 rounded-xl px-3 py-2 transition hover:bg-gray-100"
            >
                {user.image ? (
                    <img
                        src={user.image}
                        alt={user.name}
                        className="h-10 w-10 rounded-full object-cover"
                    />
                ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 font-bold text-green-800">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                )}

                <span className="max-w-32 truncate text-sm font-medium text-gray-800">
                    {user.name}
                </span>

                <span className="text-xs text-gray-500">
                    {isOpen ? "▲" : "▼"}
                </span>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <>
                    <button
                        type="button"
                        aria-label="মেনু বন্ধ করুন"
                        className="fixed inset-0 z-40 cursor-default"
                        onClick={() => setIsOpen(false)}
                    />

                    <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border border-gray-200 bg-white p-3 shadow-lg sm:w-72">
                        {/* User Information */}
                        <div className="border-b border-gray-100 px-2 py-3">
                            <p className="truncate text-sm font-bold text-gray-900">
                                {user.name}
                            </p>

                            <p className="mt-1 truncate text-xs text-gray-500">
                                {user.email}
                            </p>
                        </div>

                        {/* Profile Link */}
                        <Link
                            href="/profile"
                            onClick={() => setIsOpen(false)}
                            className="mt-2 flex items-center gap-2 rounded-lg px-2 py-3 text-sm text-gray-700 transition hover:bg-gray-100"
                        >
                            <span>👤</span>
                            <span>আমার প্রোফাইল</span>
                        </Link>

                        {/* Sign Out */}
                        <button
                            type="button"
                            onClick={handleSignOut}
                            disabled={isSigningOut}
                            className="flex w-full items-center gap-2 rounded-lg px-2 py-3 text-left text-sm text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                        >
                            <span>↪</span>
                            <span>
                                {isSigningOut ? "সাইন আউট হচ্ছে..." : "সাইন আউট"}
                            </span>
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}