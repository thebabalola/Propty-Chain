"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Building2, Menu, X, Wallet, Sun, Moon, Home, Store, Users, Award, Settings } from "lucide-react"
import { usePathname } from "next/navigation"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem("theme")

    if (savedTheme === "dark") {
      setIsDarkMode(true)
      document.documentElement.classList.add("dark")
    } else {
      // Default to light mode for first-time visitors
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
    { href: "/", label: "Home", icon: Home },
    { href: "/marketplace", label: "Marketplace", icon: Store },
    { href: "/community", label: "Community", icon: Users },
  ]

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "py-2" : "py-4"
      } bg-forest-night/80 backdrop-blur-md border-b border-olive-slate/20`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 animate-slide-in-left">
            <Building2 className="h-8 w-8 text-antique-gold animate-glow" />
            <span className="text-xl font-bold text-ivory-mist">ProptyChain</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 animate-slide-in-right">
            {navItems.map((item) => {
              const IconComponent = item.icon
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 transition-all duration-300 hover:scale-105 group ${
                    pathname === item.href 
                      ? "text-antique-gold" 
                      : "text-ivory-mist/80 hover:text-antique-gold"
                  }`}
                  title={item.label}
                >
                  <IconComponent className="w-5 h-5 transition-colors duration-300" />
                  <span className="text-sm font-medium transition-colors duration-300">
                    {item.label}
                  </span>
                </a>
              )
            })}

            <div className="w-px h-6 bg-olive-slate/30 mx-2"></div>

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
              {navItems.map((item) => {
                const IconComponent = item.icon
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-3 py-2 px-3 rounded-lg transition-all duration-300 ${
                      pathname === item.href
                        ? "text-antique-gold bg-antique-gold/10 font-semibold"
                        : "text-ivory-mist/80 hover:text-antique-gold hover:bg-forest-night/40"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <IconComponent className="w-5 h-5 transition-colors duration-300" />
                    <span className="transition-colors duration-300">{item.label}</span>
                  </a>
                )
              })}
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
