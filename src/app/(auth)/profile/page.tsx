"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession, updateUser } from "@/lib/auth-client";
import { toast } from "react-toastify";

import {
    Button,
    FieldError,
    Form,
    Input,
    Label,
    TextField,
} from "@heroui/react";

const ProfilePage = () => {
    const router = useRouter();

    const { data: session, isPending } = useSession();

    const [name, setName] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);
    const [isSigningOut, setIsSigningOut] = useState(false);
    const [message, setMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (session?.user) {
            setName(session.user.name ?? "");
        }
    }, [session?.user]);

    useEffect(() => {
        if (!isPending && !session?.user) {
            router.replace("/sign-in");
        }
    }, [isPending, session, router]);

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setMessage("");
        setErrorMessage("");

        const trimmedName = name.trim();

        if (trimmedName.length < 3) {
            setErrorMessage("নাম কমপক্ষে ৩ অক্ষরের হতে হবে।");
            return;
        }

        setIsUpdating(true);

        try {
            const { error } = await updateUser({
                name: trimmedName,
            });

            if (error) {
                toast.error(error.message || "নাম আপডেট করা যায়নি।");
                return;
            }

            toast.success("আপনার নাম সফলভাবে আপডেট হয়েছে!");
            router.refresh();
        } catch {
            toast.error("কোনো সমস্যা হয়েছে। আবার চেষ্টা করুন।");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleSignOut = async () => {
        setIsSigningOut(true);

        try {
            await signOut();
            toast.success("সাইন আউট সফল হয়েছে!");
            router.replace("/");
            router.refresh();
        } catch {
            toast.error("সাইন আউট করা যায়নি। আবার চেষ্টা করুন।");
        } finally {
            setIsSigningOut(false);
        }
    };

    if (isPending || !session?.user) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#f0f5f0]">
                <p className="text-sm text-gray-500">
                    প্রোফাইল লোড হচ্ছে...
                </p>
            </main>
        );
    }

    const user = session.user;

    return (
        <main className="min-h-screen bg-[#f0f5f0] px-4 py-8 text-[#26352b] sm:py-6">
            <div className="mx-auto w-full max-w-[900px]">
                {/* Heading */}
                <header className="mb-6">
                    <h1 className="text-2xl font-bold sm:text-[26px]">
                        আমার প্রোফাইল
                    </h1>

                    <p className="mt-1 text-sm text-[#7b857d]">
                        আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।
                    </p>
                </header>

                {/* User Information */}
                <section className="flex flex-col gap-4 rounded-2xl border border-[#dce7dd] bg-[#fbfcfb] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                    <div className="flex min-w-0 items-center gap-4">
                        {user.image ? (
                            <img
                                src={user.image}
                                alt={user.name}
                                className="h-16 w-16 shrink-0 rounded-2xl object-cover"
                            />
                        ) : (
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-green-100 text-2xl font-bold text-green-800">
                                {user.name?.charAt(0).toUpperCase() || "U"}
                            </div>
                        )}

                        <div className="min-w-0">
                            <h2 className="truncate text-lg font-bold sm:text-xl">
                                {user.name}
                            </h2>

                            <p className="mt-1 truncate text-sm text-[#7b857d] sm:text-base">
                                {user.email}
                            </p>
                        </div>
                    </div>

                    <Button
                        type="button"
                        onPress={handleSignOut}
                        isDisabled={isSigningOut}
                        className="h-10 shrink-0 rounded-lg border border-red-400 bg-transparent px-4 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                    >
                        {isSigningOut ? "সাইন আউট হচ্ছে..." : "↪ সাইন আউট"}
                    </Button>
                </section>

                {/* Profile Information Form */}
                <section className="mt-6 rounded-2xl border border-[#dce7dd] bg-[#fbfcfb] p-5 sm:p-6">
                    <h2 className="mb-6 text-lg font-bold">
                        তথ্য
                    </h2>

                    <Form
                        className="flex w-full flex-col gap-4 px-1 sm:px-5"
                        onSubmit={handleUpdate}
                    >
                        <TextField
                            isRequired
                            name="name"
                            className="w-full"
                            value={name}
                            onChange={setName}
                            validate={(value) => {
                                if (value.trim().length < 3) {
                                    return "নাম কমপক্ষে ৩ অক্ষরের হতে হবে।";
                                }

                                return null;
                            }}
                        >
                            <Label className="mb-1.5 text-sm font-medium">
                                নাম
                            </Label>

                            <Input
                                placeholder="আপনার নাম লিখুন"
                                className="h-10 w-full rounded-lg border border-[#dce7dd] bg-transparent px-3 text-sm outline-none transition focus:border-[#07883f]"
                            />

                            <FieldError className="text-xs text-red-600" />
                        </TextField>

                        {message && (
                            <p
                                role="status"
                                className="w-full rounded-lg bg-green-50 p-3 text-sm text-green-700"
                            >
                                {message}
                            </p>
                        )}

                        {errorMessage && (
                            <p
                                role="alert"
                                className="w-full rounded-lg bg-red-50 p-3 text-sm text-red-600"
                            >
                                {errorMessage}
                            </p>
                        )}

                        <Button
                            type="submit"
                            isDisabled={isUpdating}
                            className="h-10 w-full rounded-lg bg-[#07883f] text-sm font-semibold text-white shadow-[0_3px_4px_rgba(0,0,0,0.18)] transition hover:bg-[#067536] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isUpdating ? "আপডেট হচ্ছে..." : "আপডেট"}
                        </Button>
                    </Form>
                </section>
            </div>
        </main>
    );
};

export default ProfilePage;