"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Building2, Menu, X, Wallet, Sun, Moon } from "lucide-react"
import { usePathname } from "next/navigation"

export function SharedNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDarkMode(true)
      document.documentElement.classList.add("dark")
    } else {
      setIsDarkMode(false)
      document.documentElement.classList.remove("dark")
    }
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)

    if (newDarkMode) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/marketplace", label: "Marketplace" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/badges", label: "Badges" },
    { href: "/admin", label: "Admin" },
  ]

  const getActiveItem = () => {
    const activeItem = navItems.find((item) => item.href === pathname)
    return activeItem?.label || "Home"
  }

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "glass-nav py-2" : "bg-forest-night/60 backdrop-blur-md py-4"
      } border-b border-olive-slate/20`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 animate-slide-in-left">
            <Building2 className="h-8 w-8 text-antique-gold animate-glow" />
            <span className="text-xl font-bold text-ivory-mist">ProptyChain</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 animate-slide-in-right">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`transition-all duration-300 hover:text-antique-gold hover:scale-105 ${
                  pathname === item.href ? "text-antique-gold font-semibold" : "text-ivory-mist/80"
                }`}
              >
                {item.label}
              </a>
            ))}

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              className="text-ivory-mist hover:text-antique-gold hover:bg-forest-night/40 p-2"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            <Button className="btn-primary hover-lift">
              <Wallet className="w-4 h-4 mr-2" />
              Connect Wallet
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              className="text-ivory-mist hover:text-antique-gold hover:bg-forest-night/40 p-2"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-ivory-mist hover:text-antique-gold hover:bg-forest-night/40"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 animate-slide-in-bottom">
            <div className="glass-card rounded-lg p-4 space-y-3">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`block py-2 px-3 rounded-lg transition-all duration-300 ${
                    pathname === item.href
                      ? "text-antique-gold bg-antique-gold/10 font-semibold"
                      : "text-ivory-mist/80 hover:text-antique-gold hover:bg-forest-night/40"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <Button className="w-full btn-primary mt-4">
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
