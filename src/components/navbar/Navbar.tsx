"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { Menu, X, Home, Music, Phone, User, Calendar, ChevronDown, ChevronRight, Book, Mic } from "lucide-react"
import logo from "../../../public/cashmere-logo.svg"
import { Button } from "../Button"
import { UserIcon } from "../icons/User"
import { AuthDialog } from "../auth/AuthDialog"
import { studios } from "@/lib/studios"
import { services } from "@/lib/services"
import { usePathname } from "next/navigation"

interface NavbarVariantsProps {
  variant: "Home" | "Book"
}

export const NavbarVariants = ({ variant }: NavbarVariantsProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [studiosOpen, setStudiosOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const pathname = usePathname();
  const hideNavbar = pathname.startsWith('/admin') //['/admin/confirm'].includes(pathname);
console.log("hide: ", hideNavbar)
  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById("mobile-sidebar")
      const burgerButton = document.getElementById("burger-button")

      if (
        sidebar &&
        !sidebar.contains(event.target as Node) &&
        burgerButton &&
        !burgerButton.contains(event.target as Node)
      ) {
        setSidebarOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Lock body scroll when sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [sidebarOpen])
  if (hideNavbar) return null;
  switch (variant) {
    case "Home":
      return (
        <>
          {/* Desktop Navbar */}
          <nav className="w-full bg-white h-[75px] hidden md:flex flex-row items-center border border-dark-gray justify-between px-4 sm:px-8 md:px-12 ">
            <div className="flex flex-row items-center gap-4 sm:gap-8 md:gap-12">
              <Link href="/">
                <Image src={logo || "/placeholder.svg"} alt="Logo Cashmere studio" className="full h-12" />
              </Link>
              <div className="flex items-center space-x-6 poppins-regular gap-4">
                <div className="relative group">
                  <button className="flex items-center space-x-1 text-gray-700 hover:text-black">
                    <span className="text-sm ">Studi</span>
                    <ChevronDown className="h-4 w-4" strokeWidth={3} />
                  </button>
                  <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 py-4">
                    {studios.map((studio) => (
                      <Link
                        key={studio.id}
                        href={`/studio/${studio.id}`}
                        className="block px-4 py-2 text-sm poppins-medium text-gray-700 hover:bg-gray-100"
                      >
                        {studio.name}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="relative group">
                  <button className="flex items-center space-x-1 text-gray-700 hover:text-black">
                    <span className="text-sm ">Servizi</span>
                    <ChevronDown className="h-4 w-4" strokeWidth={3} />
                  </button>
                  <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 py-4 gap-2">
                    {services.slice(0, 3).map((service) => (
                      <Link
                        key={service.id}
                        href={`/service/${service.id}`}
                        className="block px-4 py-2 text-sm poppins-medium text-gray-700 hover:bg-gray-100"
                      >
                        {service.title}
                      </Link>
                    ))}
                  </div>
                </div>

                <Link href="/contacts" className=" text-sm text-gray-700 hover:text-black">
                  Contatti
                </Link>
                <Link href="/portfolio" className="text-sm  text-gray-700 hover:text-black">
                  Portfolio
                </Link>
              </div>
            </div>
            <div className="flex flex-row gap-4">
              <Link href="/book">
                <Button variant="gradient" color="black">
                  Prenota una sessione
                </Button>
              </Link>
              <AuthDialog />
            </div>
          </nav>

          {/* Mobile Navbar */}
          <nav className="w-full bg-white h-[80px] flex md:hidden items-center border border-dark-gray justify-between px-4 relative z-50">
            {/* Left - Burger Menu */}
            <button id="burger-button" className="p-2" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-6 w-6" />
            </button>

            {/* Center - Logo */}
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Link href="/">
                <Image src={logo || "/placeholder.svg"} alt="Logo Cashmere studio" width={40} height={40} />
              </Link>
            </div>

            {/* Right - Icons */}
            <div className="flex items-center space-x-2">
              <Link href="/book">
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Calendar className="h-5 w-5" />
                </Button>
              </Link>
              <AuthDialog iconOnly={true} />
            </div>
          </nav>

          {/* Mobile Sidebar */}
          <AnimatePresence>
            {sidebarOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black z-50 md:hidden"
                  onClick={() => setSidebarOpen(false)}
                />

                {/* Sidebar */}
                <motion.div
                  id="mobile-sidebar"
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "tween", duration: 0.3 }}
                  className="fixed top-0 left-0 h-full w-[280px] bg-white z-50 md:hidden overflow-y-auto"
                >
                  <div className="p-4 border-b flex justify-between items-center">
                    <Image src={logo || "/placeholder.svg"} alt="Logo Cashmere studio" width={40} height={40} />
                    <button onClick={() => setSidebarOpen(false)}>
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="p-4">
                    <ul className="space-y-4">
                      <li>
                        <Link
                          href="/"
                          className="flex items-center space-x-3 text-gray-700 hover:text-black"
                          onClick={() => setSidebarOpen(false)}
                        >
                          <Home className="h-5 w-5" />
                          <span>Home</span>
                        </Link>
                      </li>

                      <li>
                        <button
                          className="flex items-center justify-between w-full text-gray-700 hover:text-black"
                          onClick={() => setStudiosOpen(!studiosOpen)}
                        >
                          <div className="flex items-center space-x-3">
                            <Music className="h-5 w-5" />
                            <span>Studi</span>
                          </div>
                          {studiosOpen ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                        </button>

                        {studiosOpen && (
                          <ul className="mt-2 ml-8 space-y-2">
                            {studios.map((studio) => (
                              <li key={studio.id}>
                                <Link
                                  href={`/studio/${studio.id}`}
                                  className="text-gray-600 hover:text-black"
                                  onClick={() => setSidebarOpen(false)}
                                >
                                  {studio.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>

                      <li>
                        <button
                          className="flex items-center justify-between w-full text-gray-700 hover:text-black"
                          onClick={() => setServicesOpen(!servicesOpen)}
                        >
                          <div className="flex items-center space-x-3">
                            <Mic className="h-5 w-5" />
                            <span>Servizi</span>
                          </div>
                          {servicesOpen ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                        </button>

                        {servicesOpen && (
                          <ul className="mt-2 ml-8 space-y-2">
                            {services.slice(0, 3).map((service) => (
                              <li key={service.id}>
                                <Link
                                  href={`/service/${service.id}`}
                                  className="text-gray-600 hover:text-black"
                                  onClick={() => setSidebarOpen(false)}
                                >
                                  {service.title}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>

                      <li>
                        <Link
                          href="/contacts"
                          className="flex items-center space-x-3 text-gray-700 hover:text-black"
                          onClick={() => setSidebarOpen(false)}
                        >
                          <Phone className="h-5 w-5" />
                          <span>Contatti</span>
                        </Link>
                      </li>

                      <li>
                        <Link
                          href="/portfolio"
                          className="flex items-center space-x-3 text-gray-700 hover:text-black"
                          onClick={() => setSidebarOpen(false)}
                        >
                          <Book className="h-5 w-5" />
                          <span>Portfolio</span>
                        </Link>
                      </li>
                    </ul>

                    <div className="absolute bottom-8 left-0 right-0 px-4 space-y-4">
                      <Link href="/book" onClick={() => setSidebarOpen(false)}>
                        <Button variant="gradient" color="black" className="w-full">
                          <Calendar className="h-5 w-5 mr-2" />
                          Prenota una sessione
                        </Button>
                      </Link>

                      <AuthDialog isMobile={true} onClose={() => setSidebarOpen(false)} />
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </>
      )

    case "Book":
      return (
        <>
          {/* Desktop Navbar */}
          <nav className="w-full bg-white h-[80px] hidden md:flex flex-row items-center border border-dark-gray justify-between px-4 sm:px-8 md:px-12 lg:px-16 xl:px-16">
            <div className="flex flex-row items-center gap-4 sm:gap-8 md:gap-16">
              <Link href="/">
                <Image src={logo || "/placeholder.svg"} height={40} alt="Logo Cashmere studio" />
              </Link>
            </div>
            <div className="flex flex-row gap-2">
              <Link href="/dashboard">
                <Button variant="outline" color="black">
                  <UserIcon /> Area personale
                </Button>
              </Link>
            </div>
          </nav>

          {/* Mobile Navbar */}
          <nav className="w-full bg-white h-[80px] flex md:hidden items-center border border-dark-gray justify-between px-4">
            {/* Left - Burger Menu */}
            <button id="burger-button" className="p-2" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-6 w-6" />
            </button>

            {/* Center - Logo */}
            <div>
              <Link href="/">
                <Image src={logo || "/placeholder.svg"} alt="Logo Cashmere studio" width={40} height={40} />
              </Link>
            </div>

            {/* Right - Icons */}
            <div className="flex items-center space-x-2">
              <AuthDialog iconOnly={true} />
            </div>
          </nav>

          {/* Mobile Sidebar */}
          <AnimatePresence>
            {sidebarOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black z-50 md:hidden"
                  onClick={() => setSidebarOpen(false)}
                />

                {/* Sidebar */}
                <motion.div
                  id="mobile-sidebar"
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "tween", duration: 0.3 }}
                  className="fixed top-0 left-0 h-full w-[280px] bg-white z-50 md:hidden overflow-y-auto"
                >
                  <div className="p-4 border-b flex justify-between items-center">
                    <Image src={logo || "/placeholder.svg"} alt="Logo Cashmere studio" width={40} height={40} />
                    <button onClick={() => setSidebarOpen(false)}>
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="p-4">
                    <ul className="space-y-4">
                      <li>
                        <Link
                          href="/"
                          className="flex items-center space-x-3 text-gray-700 hover:text-black"
                          onClick={() => setSidebarOpen(false)}
                        >
                          <Home className="h-5 w-5" />
                          <span>Home</span>
                        </Link>
                      </li>

                      <li>
                        <Link
                          href="/dashboard"
                          className="flex items-center space-x-3 text-gray-700 hover:text-black"
                        >
                          <User className="h-5 w-5" />
                          <span>Area personale</span>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </>
      )

    default:
      return null
  }
}

