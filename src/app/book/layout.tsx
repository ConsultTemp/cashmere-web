"use client"
import type React from "react"
import { NavigationGuard } from "./components/NavigationGuard"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {

    
  return (
    <>
      <NavigationGuard />
      <div className="flex flex-col w-full items-center pb-12">{children}</div>
    </>
  )
}
