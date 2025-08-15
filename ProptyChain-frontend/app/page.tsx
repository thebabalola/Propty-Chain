"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Building2,
  Shield,
  Users,
  Award,
  TrendingUp,
  MapPin,
  Eye,
  Heart,
  Lock,
  Home,
  CheckCircle,
  Phone,
  Calendar,
  ArrowRight,
} from "lucide-react"
import { useEffect, useRef, useState } from "react"

export default function HomePage() {
  const [currentIcon, setCurrentIcon] = useState(0)
  const heroRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)

  // Morphing icons for hero section
  const morphingIcons = [
    { icon: Eye, label: "Transparent", color: "text-forest-night dark:text-ivory-mist" },
    { icon: Heart, label: "Trusted", color: "text-red-600" },
    { icon: Lock, label: "Secure", color: "text-green-600" },
  ]

  // Cycle through morphing icons
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIcon((prev) => (prev + 1) % morphingIcons.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("scroll-visible")
            entry.target.classList.remove("scroll-hidden")
          }
        })
      },
      { threshold: 0.1 },
    )

    const elements = document.querySelectorAll(".scroll-animate")
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  const CurrentIcon = morphingIcons[currentIcon].icon

  return (
    <div className="min-h-screen bg-ivory-mist dark:bg-slate-900 overflow-hidden theme-transition">

      {/* Hero Section - Split Design with Primary Colors */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center overflow-hidden section-gradient-primary theme-transition"
      >
        {/* Slow-moving background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Drifting building outlines */}
          <div className="absolute top-20 animate-drift-left opacity-20">
            <Building2 className="w-32 h-32 text-ivory-mist" />
          </div>
          <div className="absolute top-60 animate-drift-right opacity-20">
            <Home className="w-24 h-24 text-antique-gold" />
          </div>
          <div className="absolute top-40 animate-drift-left opacity-20" style={{ animationDelay: "8s" }}>
            <MapPin className="w-20 h-20 text-ivory-mist" />
          </div>

          {/* Floating property shapes */}
          <div className="absolute top-32 left-1/4 animate-float-building">
            <div className="w-16 h-20 bg-gradient-to-t from-antique-gold/30 to-ivory-mist/30 rounded-t-lg border border-ivory-mist/30"></div>
          </div>
          <div className="absolute bottom-40 right-1/4 animate-float-building" style={{ animationDelay: "3s" }}>
            <div className="w-12 h-16 bg-gradient-to-t from-ivory-mist/30 to-antique-gold/30 rounded-t-lg border border-ivory-mist/30"></div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen py-20">
            {/* Left Side - Content */}
            <div className="space-y-8 scroll-animate scroll-hidden">
              <Badge className="bg-antique-gold/20 text-antique-gold border-antique-gold/40 px-4 py-2 text-sm font-medium animate-bounce-in">
                🚀 Revolutionary Web3 Real Estate
              </Badge>

              <div className="space-y-6">
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                  <span className="text-ivory-mist">Unlock the</span>
                  <br />
                  <span className="text-antique-gold">
                    Future of
                  </span>
                  <br />
                  <span className="text-ivory-mist">Real Estate</span>
                </h1>

                {/* Morphing Icons Section */}
                <div className="flex items-center space-x-4 py-4">
                  <div className="flex items-center space-x-2 px-4 py-2 bg-forest-night/60 backdrop-blur-sm border border-olive-slate/30 rounded-full">
                    <CurrentIcon className={`w-6 h-6 ${morphingIcons[currentIcon].color} animate-morph-transparency`} />
                    <span className="text-ivory-mist font-medium">{morphingIcons[currentIcon].label}</span>
                  </div>
                  <div className="text-antique-gold">•</div>
                  <div className="text-ivory-mist font-medium">on Blockchain</div>
                </div>

                <p className="text-xl text-ivory-mist/90 leading-relaxed max-w-lg">
                  Experience seamless transactions in the decentralized world.
                  <span className="font-semibold text-antique-gold"> No fraud, no intermediaries</span> — just pure
                  innovation in real estate.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="btn-primary text-ivory-mist px-8 py-4 text-lg font-semibold">
                  <Home className="w-5 h-5 mr-2" />
                  Explore Our Listings
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-ivory-mist text-ivory-mist hover:bg-ivory-mist hover:text-forest-night px-8 py-4 text-lg font-semibold hover-glow-premium bg-transparent"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Connect Wallet
                </Button>
              </div>


            </div>

            {/* Right Side - Interactive Visual */}
            <div className="relative scroll-animate scroll-hidden" style={{ animationDelay: "0.3s" }}>
              <div className="relative">
                {/* Main Property Image with Overlay */}
                <div className="relative overflow-hidden rounded-3xl shadow-2xl hover-premium">
                  <img
                    src="/luxury-glass-building.png"
                    alt="Premium Real Estate"
                    className="w-full h-[600px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-night/30 via-transparent to-transparent"></div>

                  {/* Trust Elements */}
                  <div className="absolute top-6 right-6 bg-forest-night/60 backdrop-blur-sm border border-olive-slate/30 p-4 rounded-xl animate-float max-w-48 theme-transition">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-semibold text-ivory-mist">Premium Real Estate</span>
                    </div>
                    <div className="text-xs text-ivory-mist/80">4.9 Rating</div>
                  </div>

                  <div className="absolute bottom-6 left-6 bg-forest-night/60 backdrop-blur-sm border border-olive-slate/30 p-4 rounded-xl animate-float-delayed max-w-56 theme-transition">
                    <div className="text-lg font-bold text-ivory-mist mb-1">₦45M</div>
                    <div className="text-sm text-ivory-mist/80">3 bed • 2 bath • Lagos</div>
                    <div className="flex items-center space-x-1 mt-2">
                      <Shield className="w-3 h-3 text-antique-gold" />
                      <span className="text-xs text-antique-gold font-medium">NFT Verified</span>
                    </div>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="absolute bottom-6 right-6 flex space-x-2">
                    <Button size="sm" className="bg-antique-gold hover:bg-antique-gold/90 text-forest-night">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button size="sm" className="bg-forest-night hover:bg-forest-night/90 text-ivory-mist">
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                </div>


              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 section-footer-style theme-transition">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 scroll-animate scroll-hidden">
            <Badge className="bg-antique-gold/20 text-antique-gold border-antique-gold/40 mb-4">
              Revolutionary Features
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-ivory-mist mb-6">
              Why Choose <span className="text-antique-gold">ProptyChain?</span>
            </h2>
            <p className="text-xl text-ivory-mist/80 max-w-3xl mx-auto leading-relaxed">
              Experience the future of real estate with cutting-edge blockchain technology, community-driven insights,
              and unparalleled security for everyone.
            </p>
          </div>

          {/* Alternating Feature Layout */}
          <div className="space-y-20">
            {[
              {
                icon: Shield,
                title: "NFT Property Titles",
                description:
                  "Immutable blockchain records eliminate fraud and ensure transparent ownership verification. Every property comes with a unique NFT that proves authentic ownership.",
                image: "/blockchain-nft-property-certificate-digital.png",
                direction: "left",
                features: ["Instant verification", "Fraud protection", "Legal compliance"],
              },
              {
                icon: Users,
                title: "Community Reviews",
                description:
                  "Real reviews from verified residents, tenants, and community members you can trust. Our reputation system ensures authentic feedback from real users.",
                image: "/community-real-estate-reviews.png",
                direction: "right",
                features: ["Agent verification", "Client testimonials", "Performance tracking"],
              },
              {
                icon: TrendingUp,
                title: "Smart Escrow",
                description:
                  "Automated smart contracts secure transactions and protect both buyers and sellers. No more waiting for manual processes or worrying about fraud.",
                image: "/blockchain-escrow.png",
                direction: "left",
                features: ["Automated releases", "Dispute resolution", "Multi-signature security"],
              },
              {
                icon: Award,
                title: "Achievement Badges",
                description:
                  "Earn Soulbound NFT badges for contributions and build your reputation in the ecosystem. Unlock exclusive features and recognition.",
                image: "/nft-gamification-badges.png",
                direction: "right",
                features: ["Professional badges", "Performance metrics", "Industry recognition"],
              },
            ].map((feature, index) => (
              <div
                key={index}
                className={`grid lg:grid-cols-2 gap-12 items-center scroll-animate scroll-hidden ${
                  feature.direction === "right" ? "lg:grid-flow-col-dense" : ""
                }`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className={feature.direction === "right" ? "lg:col-start-2" : ""}>
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-antique-gold to-olive-slate rounded-2xl flex items-center justify-center animate-scale-glow">
                        <feature.icon className="w-7 h-7 text-ivory-mist" />
                      </div>
                      <h3 className="text-3xl font-bold text-ivory-mist">{feature.title}</h3>
                    </div>
                    <p className="text-lg text-ivory-mist/80 leading-relaxed">{feature.description}</p>

                    {/* Feature List */}
                    <ul className="space-y-2">
                      {feature.features.map((item, idx) => (
                        <li key={idx} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-antique-gold" />
                          <span className="text-ivory-mist/90">{item}</span>
                        </li>
                      ))}
                    </ul>

                    <Button className="btn-primary text-ivory-mist">
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>

                <div className={feature.direction === "right" ? "lg:col-start-1" : ""}>
                  <div className="relative hover-premium">
                    <img
                      src={feature.image || "/placeholder.svg"}
                      alt={feature.title}
                      className="w-full h-[400px] object-cover rounded-2xl shadow-xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest-night/10 to-transparent rounded-2xl"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={featuresRef} className="py-20 section-ivory-background theme-transition">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16 scroll-animate scroll-hidden">
            <Badge className="bg-forest-night/10 text-forest-night border-forest-night/30 dark:bg-antique-gold/20 dark:text-antique-gold dark:border-antique-gold/40 mb-4">
              Advanced Technology
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-forest-night dark:text-ivory-mist mb-6">
              Industry-Leading <span className="text-antique-gold">Technology</span>
            </h2>
            <p className="text-xl text-forest-night/80 dark:text-ivory-mist/80 max-w-3xl mx-auto leading-relaxed">
              Built for everyone who demands excellence, security, and results in real estate transactions.
            </p>
          </div>

          {/* Technology Stats */}
          <div className="grid md:grid-cols-4 gap-8 mb-16">
            {[
              { value: "99.9%", label: "Uptime", icon: Shield },
              { value: "< 2s", label: "Transaction Speed", icon: TrendingUp },
              { value: "256-bit", label: "Encryption", icon: Lock },
              { value: "24/7", label: "Support", icon: Users },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center glass-card p-6 rounded-xl scroll-animate scroll-hidden theme-transition"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <stat.icon className="w-8 h-8 text-antique-gold mx-auto mb-3" />
                <div className="text-2xl font-bold text-forest-night dark:text-ivory-mist mb-1">{stat.value}</div>
                <div className="text-sm text-forest-night/70 dark:text-ivory-mist/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Keep unchanged as requested */}
      <section className="py-20 bg-gradient-to-br from-forest-night via-olive-slate to-forest-night relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/abstract-geometric-pattern.png')] opacity-10"></div>

        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="scroll-animate scroll-hidden">
            <h2 className="text-4xl lg:text-5xl font-bold text-ivory-mist mb-6">Ready to Transform Real Estate?</h2>
            <p className="text-xl text-ivory-mist/80 mb-10 leading-relaxed">
              Join thousands of users already building the future of property transactions. Experience the revolution
              today.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                size="lg"
                className="bg-antique-gold text-forest-night hover:bg-antique-gold/90 px-8 py-4 text-lg font-semibold hover-premium"
              >
                <Home className="w-5 h-5 mr-2" />
                Start Exploring
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-ivory-mist text-ivory-mist hover:bg-ivory-mist/10 px-8 py-4 text-lg font-semibold hover-glow-premium bg-transparent"
              >
                <Users className="w-5 h-5 mr-2" />
                Join Community
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
