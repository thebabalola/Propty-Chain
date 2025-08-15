"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Building2, Menu, X, Wallet, Sun, Moon } from "lucide-react"
import { usePathname } from "next/navigation"

export function SharedNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [currentSection, setCurrentSection] = useState("hero")
  const pathname = usePathname()
  const observerRef = useRef<IntersectionObserver | null>(null)

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

  // Intersection Observer for section detection
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "-10% 0px -80% 0px", // Trigger when section is in the top 10% of viewport
      threshold: 0,
    }

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.getAttribute("data-section-id")
          if (sectionId) {
            setCurrentSection(sectionId)
          }
        }
      })
    }, options)

    // Observe all sections with data-section-id
    const sections = document.querySelectorAll("[data-section-id]")
    sections.forEach((element) => {
      observerRef.current?.observe(element)
    })

    // Set initial section based on scroll position
    const handleInitialSection = () => {
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight
      
      // Check which section is most visible
      sections.forEach((element) => {
        const rect = element.getBoundingClientRect()
        const sectionId = element.getAttribute("data-section-id")
        
        if (rect.top <= windowHeight * 0.2 && rect.bottom >= windowHeight * 0.2) {
          if (sectionId) {
            setCurrentSection(sectionId)
          }
        }
      })
    }

    // Call once on mount
    handleInitialSection()

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
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

  // Get header background based on current section
  const getHeaderBackground = () => {
    if (!isScrolled) {
      // Initial state - always dark with transparency
      return "bg-forest-night/60 backdrop-blur-md"
    }

    switch (currentSection) {
      case "hero":
        // Hero section is dark, so header should be dark with transparency
        return "bg-forest-night/80 backdrop-blur-md"
      case "features":
        // Features section is dark, so header should be dark with transparency
        return "bg-forest-night/80 backdrop-blur-md"
      case "technology":
        // Technology section is light (ivory), so header should be dark for contrast
        return "bg-forest-night/90 backdrop-blur-md"
      case "cta":
        // CTA section is dark, so header should be dark with transparency
        return "bg-forest-night/80 backdrop-blur-md"
      case "footer":
        // Footer is dark, so header should be dark with transparency
        return "bg-forest-night/80 backdrop-blur-md"
      default:
        return "bg-forest-night/80 backdrop-blur-md"
    }
  }

  // Get text color based on current section
  const getTextColor = () => {
    if (!isScrolled) {
      return "text-ivory-mist"
    }

    // Check if we're at the bottom of the page (footer area)
    const isAtBottom = typeof window !== 'undefined' && 
      window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 200

    // If we're at the bottom, always use light text (footer is dark)
    if (isAtBottom) {
      return "text-ivory-mist"
    }

    switch (currentSection) {
      case "technology":
        // Technology section is light, so text should be dark
        return "text-forest-night"
      case "hero":
      case "features":
      case "cta":
      case "footer":
        // All these sections have dark backgrounds, so text should be light
        return "text-ivory-mist"
      default:
        // Fallback to light text for any unknown sections
        return "text-ivory-mist"
    }
  }

  // Get border color based on current section
  const getBorderColor = () => {
    if (!isScrolled) {
      return "border-olive-slate/20"
    }

    switch (currentSection) {
      case "technology":
        return "border-forest-night/30"
      default:
        return "border-olive-slate/20"
    }
  }

  return (
    <nav
      className={`fixed top-0 w-full z-50 header-adaptive ${
        isScrolled ? "py-2" : "py-4"
      } ${getHeaderBackground()} ${getBorderColor()}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 animate-slide-in-left">
            <Building2 className={`h-8 w-8 text-antique-gold animate-glow ${getTextColor()}`} />
            <span className={`text-xl font-bold ${getTextColor()}`}>ProptyChain</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 animate-slide-in-right">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`transition-all duration-300 hover:text-antique-gold hover:scale-105 relative ${
                  pathname === item.href 
                    ? "text-antique-gold font-semibold" 
                    : `${getTextColor()}/80 hover:${getTextColor()}`
                }`}
              >
                {item.label}
                {pathname === item.href && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-antique-gold rounded-full animate-pulse"></div>
                )}
              </a>
            ))}

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              className={`${getTextColor()} hover:text-antique-gold hover:bg-forest-night/40 p-2`}
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
              className={`${getTextColor()} hover:text-antique-gold hover:bg-forest-night/40 p-2`}
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`${getTextColor()} hover:text-antique-gold hover:bg-forest-night/40`}
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
                      : `${getTextColor()}/80 hover:text-antique-gold hover:bg-forest-night/40`
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
