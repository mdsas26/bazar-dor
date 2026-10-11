"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const Hero = () => {
    const [date, setDate] = useState("");

    useEffect(() => {
        const currentDate = new Intl.DateTimeFormat("bn-BD", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
            timeZone: "Asia/Dhaka",
        }).format(new Date());

        setDate(currentDate);
    }, []);

    return (
        <section className="px-4 py-6 sm:px-6 sm:py-8">
            <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 rounded-[24px] border border-[#dce6dc] bg-[#fbfdfb] p-5 sm:p-8 md:flex-row md:gap-10 md:p-10">

                {/* Left Content */}
                <div className="w-full md:flex-1">
                    <span className="inline-block rounded-full bg-[#e2f2e8] px-4 py-2 text-sm font-medium text-green-700 sm:text-base">
                        {date}
                    </span>

                    <h1 className="mt-4 text-3xl leading-tight font-extrabold text-[#202a22] sm:text-4xl lg:text-5xl">
                        আজকের বাজারের দাম এক নজরে
                    </h1>

                    <p className="mt-5 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
                        চাল, ডাল, তেল, সবজি, মাছ, মাংস, চিনি ও মসলার দাম —
                        বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বোচ্চ এবং দামের
                        পরিবর্তন এক জায়গায়।
                    </p>

                    <Link
                        href="#সব-পণ্য"
                        className="mt-7 inline-flex min-h-12 items-center justify-center rounded-lg bg-green-700 px-7 py-3 font-semibold text-white shadow-md transition hover:bg-green-800"
                    >
                        সব পণ্য দেখুন
                    </Link>
                </div>

                {/* Right Image */}
                <div className="relative flex w-full items-center justify-center md:w-[32%] md:shrink-0">
                    <Image
                        src="/bazar-hero.png"
                        alt="বাজারের বিভিন্ন পণ্য"
                        width={320}
                        height={280}
                        priority
                        className="h-auto w-52 sm:w-64 md:w-full md:max-w-[320px]"
                    />
                </div>

            </div>
        </section>
    );
};

export default Hero;