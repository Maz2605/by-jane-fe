"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom"; // Import createPortal
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoutButtonProps {
    className?: string;
    children?: React.ReactNode;
    iconSize?: number;
    showIcon?: boolean;
}

export default function LogoutButton({
    className,
    children,
    iconSize = 20,
    showIcon = true
}: LogoutButtonProps) {
    const [showConfirm, setShowConfirm] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Ensure portal only renders on client
    useEffect(() => {
        setMounted(true);
        // Prevent scrolling when modal is open
        if (showConfirm) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => { document.body.style.overflow = "unset"; };
    }, [showConfirm]);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        await signOut({ callbackUrl: "/login" });
    };

    return (
        <>
            <button
                onClick={() => setShowConfirm(true)}
                className={cn("flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors", className)}
            >
                {showIcon && <LogOut size={iconSize} />}
                {children || "Đăng xuất"}
            </button>

            {/* Portal to document.body ensures modal is top-level */}
            {mounted && createPortal(
                <AnimatePresence>
                    {showConfirm && (
                        <div className="fixed inset-0 z-[99999] flex items-center justify-center px-4">
                            {/* Backdrop with higher blur and opacity */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowConfirm(false)}
                                className="absolute inset-0 bg-black/60 backdrop-blur-md"
                            />

                            {/* Modal */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden z-10 relative"
                            >
                                <div className="p-6 text-center">
                                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                                        <LogOut size={24} />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">Đăng xuất?</h3>
                                    <p className="text-gray-500 mb-6">
                                        Bạn có chắc chắn muốn đăng xuất khỏi hệ thống không?
                                    </p>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setShowConfirm(false)}
                                            disabled={isLoggingOut}
                                            className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors disabled:opacity-50"
                                        >
                                            Hủy
                                        </button>
                                        <button
                                            onClick={handleLogout}
                                            disabled={isLoggingOut}
                                            className="flex-1 py-2.5 px-4 bg-[#FF5E4D] hover:bg-[#ff4533] text-white font-medium rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            {isLoggingOut ? "Đang xử lý..." : "Đăng xuất"}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    );
}
