"use client";

import { useState, useEffect } from "react";
import { signIn, signUp } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import {
    Button,
    FieldError,
    Form,
    Input,
    Label,
    TextField,
} from "@heroui/react";

const SignUpPage = () => {
    const router = useRouter();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        if (params.get("reason") === "auth-required") {
            toast.info("পণ্যের বিস্তারিত দেখতে আগে সাইন আপ করুন।");
            window.history.replaceState({}, "", "/sign-up");
        }
    }, []);

    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMessage("");

        if (password !== confirmPassword) {
            setErrorMessage("দুটি পাসওয়ার্ড মিলছে না");
            return;
        }

        setIsLoading(true);

        const formData = new FormData(e.currentTarget);

        const data = Object.fromEntries(
            formData.entries()
        ) as Record<string, string>;

        try {
            const { error } = await signUp.email({
                name: data.name,
                email: data.email,
                password: data.password,
            });

            if (error) {
                toast.error(error.message || "অ্যাকাউন্ট তৈরি করা যায়নি।");
                return;
            }

            toast.success("সাইন আপ সফল হয়েছে!");
            router.push("/");
            router.refresh();
        } catch {
            setErrorMessage(
                "কোনো সমস্যা হয়েছে। আবার চেষ্টা করুন।"
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setErrorMessage("");

        try {
            await signIn.social({
                provider: "google",
                callbackURL: "/",
            });
        } catch {
            toast.error("Google দিয়ে সাইন ইন করা যায়নি।");
        }
    };

    const handleGitHubSignIn = async () => {
        setErrorMessage("");

        try {
            await signIn.social({
                provider: "github",
                callbackURL: "/",
            });
        } catch {
            toast.error("GitHub দিয়ে সাইন ইন করা যায়নি।");
        }
    };

    return (
        <main className="min-h-screen bg-[#f0f5f0] px-4 py-8 text-[#26352b] sm:py-5">
            <div className="mx-auto w-full max-w-[520px]">
                {/* Heading */}
                <header className="mb-6 text-center">
                    <h1 className="text-2xl font-bold tracking-tight sm:text-[26px]">
                        অ্যাকাউন্ট তৈরি করুন
                    </h1>

                    <p className="mt-1 text-sm text-[#7b857d]">
                        বিশ্বস্ত বাজার সেবা পেতে এবং সব বিস্তারিত দাম দেখতে।
                    </p>
                </header>

                {/* Sign Up Form */}
                <section className="rounded-2xl border border-[#dce7dd] bg-[#fbfcfb] p-6 shadow-sm sm:p-8">
                    <Form
                        className="flex w-full flex-col gap-4"
                        onSubmit={onSubmit}
                    >
                        {/* Name */}
                        <TextField
                            isRequired
                            name="name"
                            className="w-full"
                            validate={(value) => {
                                if (value.trim().length < 3) {
                                    return "নাম কমপক্ষে ৩ অক্ষরের হতে হবে";
                                }

                                return null;
                            }}
                        >
                            <Label className="mb-1.5 text-sm font-medium">
                                নাম
                            </Label>

                            <Input
                                placeholder="যেমন: রহিম উদ্দিন"
                                className="h-10 w-full rounded-lg border border-[#dce7dd] bg-transparent px-3 text-sm outline-none transition focus:border-[#07883f]"
                            />

                            <FieldError className="text-xs text-red-600" />
                        </TextField>

                        {/* Email */}
                        <TextField
                            isRequired
                            name="email"
                            type="email"
                            className="w-full"
                            validate={(value) => {
                                if (
                                    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                                        value
                                    )
                                ) {
                                    return "সঠিক ইমেইল ঠিকানা দিন";
                                }

                                return null;
                            }}
                        >
                            <Label className="mb-1.5 text-sm font-medium">
                                ইমেইল
                            </Label>

                            <Input
                                placeholder="you@example.com"
                                className="h-10 w-full rounded-lg border border-[#dce7dd] bg-transparent px-3 text-sm outline-none transition focus:border-[#07883f]"
                            />

                            <FieldError className="text-xs text-red-600" />
                        </TextField>

                        {/* Password */}
                        <TextField
                            isRequired
                            name="password"
                            type="password"
                            className="w-full"
                            validate={(value) => {
                                if (value.length < 8) {
                                    return "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে";
                                }

                                if (!/[A-Z]/.test(value)) {
                                    return "কমপক্ষে একটি বড় হাতের ইংরেজি অক্ষর দিন";
                                }

                                if (!/[0-9]/.test(value)) {
                                    return "কমপক্ষে একটি সংখ্যা দিন";
                                }

                                return null;
                            }}
                        >
                            <Label className="mb-1.5 text-sm font-medium">
                                পাসওয়ার্ড
                            </Label>

                            <Input
                                placeholder="কমপক্ষে ৮ অক্ষর"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="h-10 w-full rounded-lg border border-[#dce7dd] bg-transparent px-3 text-sm outline-none transition focus:border-[#07883f]"
                            />

                            <FieldError className="text-xs text-red-600" />
                        </TextField>

                        {/* Confirm Password */}
                        <TextField
                            isRequired
                            name="confirmPassword"
                            type="password"
                            className="w-full"
                            validate={(value) => {
                                if (!value) {
                                    return "পাসওয়ার্ড আবার লিখুন";
                                }

                                if (value !== password) {
                                    return "দুটি পাসওয়ার্ড মিলছে না";
                                }

                                return null;
                            }}
                        >
                            <Label className="mb-1.5 text-sm font-medium">
                                পাসওয়ার্ড নিশ্চিত করুন
                            </Label>

                            <Input
                                placeholder="আবার লিখুন"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                className="h-10 w-full rounded-lg border border-[#dce7dd] bg-transparent px-3 text-sm outline-none transition focus:border-[#07883f]"
                            />

                            <FieldError className="text-xs text-red-600" />
                        </TextField>

                        {/* Error Message */}
                        {errorMessage && (
                            <p
                                role="alert"
                                className="w-full rounded-lg bg-red-50 p-3 text-sm text-red-600"
                            >
                                {errorMessage}
                            </p>
                        )}

                        {/* Submit */}
                        <Button
                            type="submit"
                            isDisabled={isLoading}
                            className="mt-1 h-10 w-full rounded-lg bg-[#07883f] text-sm font-semibold text-white shadow-[0_3px_4px_rgba(0,0,0,0.18)] transition hover:bg-[#067536] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isLoading
                                ? "অ্যাকাউন্ট তৈরি হচ্ছে..."
                                : "অ্যাকাউন্ট তৈরি করুন"}
                        </Button>
                    </Form>

                    {/* Divider */}
                    <div className="my-4 flex items-center gap-4">
                        <div className="h-px flex-1 bg-[#dce4dd]" />

                        <span className="text-xs text-[#68736a]">
                            অথবা
                        </span>

                        <div className="h-px flex-1 bg-[#dce4dd]" />
                    </div>

                    {/* Social Sign Up */}
                    <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
                        {/* Google */}
                        <Button
                            type="button"
                            onPress={handleGoogleSignIn}
                            className="flex h-12 w-full min-w-0 items-center justify-center gap-2 overflow-hidden rounded-lg border border-[#dce7dd] bg-transparent px-2 text-xs font-semibold text-[#26352b] hover:bg-[#f0f5f0] sm:text-sm"
                        >
                            <span className="shrink-0 text-lg font-bold text-[#4285F4]">
                                G
                            </span>

                            <span className="whitespace-nowrap">
                                Google দিয়ে চালিয়ে যান
                            </span>
                        </Button>

                        {/* GitHub */}
                        <Button
                            type="button"
                            onPress={handleGitHubSignIn}
                            className="flex h-12 w-full min-w-0 items-center justify-center gap-2 overflow-hidden rounded-lg border border-[#dce7dd] bg-transparent px-2 text-xs font-semibold text-[#26352b] hover:bg-[#f0f5f0] sm:text-sm"
                        >
                            <svg
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                                className="h-4 w-4 shrink-0 fill-current"
                            >
                                <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.53v-2.08c-3.1.68-3.76-1.32-3.76-1.32-.5-1.29-1.24-1.63-1.24-1.63-1.02-.7.08-.69.08-.69 1.12.08 1.71 1.15 1.71 1.15 1 .1.85 2.17 3.54 1.53.1-.73.39-1.23.7-1.51-2.47-.28-5.07-1.24-5.07-5.5 0-1.21.43-2.2 1.15-2.98-.12-.28-.5-1.42.11-2.95 0 0 .94-.3 3.05 1.14a10.6 10.6 0 0 1 5.55 0c2.11-1.44 3.05-1.14 3.05-1.14.61 1.53.23 2.67.11 2.95.72.78 1.15 1.77 1.15 2.98 0 4.27-2.6 5.22-5.08 5.49.4.34.75 1 .75 2.02V22c0 .29.2.63.76.52A11.1 11.1 0 0 0 12 .9Z" />
                            </svg>

                            <span className="whitespace-nowrap">
                                GitHub দিয়ে চালিয়ে যান
                            </span>
                        </Button>
                    </div>

                    {/* Sign In Link */}
                    <p className="mt-4 text-center text-sm">
                        অ্যাকাউন্ট আছে?{" "}
                        <Link
                            href="/sign-in"
                            className="font-medium text-[#07883f] hover:underline"
                        >
                            সাইন ইন করুন
                        </Link>
                    </p>
                </section>

                {/* Back to Home */}
                <div className="mt-5 text-center">
                    <Link
                        href="/"
                        className="text-sm text-[#7b857d] transition hover:text-[#07883f]"
                    >
                        ← হোম পেজে ফিরে যান
                    </Link>
                </div>
            </div>
        </main>
    );
};

export default SignUpPage;