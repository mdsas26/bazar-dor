import { Spinner } from "@heroui/react";

export default function Loading() {
    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center gap-3">
            {/* Spinner inherits this text color */}
            <div className="text-blue-600 dark:text-blue-400">
                <Spinner size="xl" color="current" />
            </div>
            <span className="text-sm text-gray-500">লোড হচ্ছে...</span>
        </div>
    );
}