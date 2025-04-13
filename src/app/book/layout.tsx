"use client"


import { NavbarVariants } from "@/components/navbar/Navbar"
import type React from "react" // Added import for React

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {

    return <>
        <div className="flex flex-col w-full items-center pb-12">
            {children}
        </div>
    </>
}

