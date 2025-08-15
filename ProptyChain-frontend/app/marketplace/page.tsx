"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, Star, Heart, Search, Filter, Home, Building, Warehouse, TreePine } from "lucide-react"

// Mock property data
const properties = [
  {
    id: 1,
    title: "Luxury Villa in Victoria Island",
    location: "Victoria Island, Lagos",
    price: "₦450,000,000",
    type: "Villa",
    rating: 4.8,
    reviews: 24,
    image: "/modern-luxury-villa-pool.png",
    owner: "0x1234...5678",
    badges: ["Verified", "Premium"],
    bedrooms: 5,
    bathrooms: 4,
    area: "650 sqm",
  },
  {
    id: 2,
    title: "Modern Apartment in Lekki",
    location: "Lekki Phase 1, Lagos",
    price: "₦85,000,000",
    type: "Apartment",
    rating: 4.6,
    reviews: 18,
    image: "/placeholder-4v8i4.png",
    owner: "0x9876...4321",
    badges: ["Verified"],
    bedrooms: 3,
    bathrooms: 2,
    area: "120 sqm",
  },
  {
    id: 3,
    title: "Commercial Office Space",
    location: "Ikeja GRA, Lagos",
    price: "₦200,000,000",
    type: "Commercial",
    rating: 4.7,
    reviews: 12,
    image: "/modern-office-glass.png",
    owner: "0x5555...9999",
    badges: ["Verified", "Commercial"],
    bedrooms: 0,
    bathrooms: 4,
    area: "500 sqm",
  },
  {
    id: 4,
    title: "Cozy Family House",
    location: "Magodo, Lagos",
    price: "₦120,000,000",
    type: "House",
    rating: 4.5,
    reviews: 31,
    image: "/family-house-garden-driveway.png",
    owner: "0x7777...3333",
    badges: ["Verified"],
    bedrooms: 4,
    bathrooms: 3,
    area: "280 sqm",
  },
  {
    id: 5,
    title: "Waterfront Penthouse",
    location: "Banana Island, Lagos",
    price: "₦800,000,000",
    type: "Penthouse",
    rating: 4.9,
    reviews: 8,
    image: "/luxury-penthouse-ocean-view.png",
    owner: "0x2222...8888",
    badges: ["Verified", "Premium", "Exclusive"],
    bedrooms: 6,
    bathrooms: 5,
    area: "900 sqm",
  },
  {
    id: 6,
    title: "Investment Land Plot",
    location: "Abuja FCT",
    price: "₦50,000,000",
    type: "Land",
    rating: 4.3,
    reviews: 6,
    image: "/empty-land-plot.png",
    owner: "0x4444...6666",
    badges: ["Verified"],
    bedrooms: 0,
    bathrooms: 0,
    area: "1000 sqm",
  },
]

export default function MarketplacePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [priceRange, setPriceRange] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [properties, setProperties] = useState(properties)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState(false)

  const getPropertyIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "villa":
      case "house":
        return <Home className="w-4 h-4" />
      case "apartment":
      case "penthouse":
        return <Building className="w-4 h-4" />
      case "commercial":
        return <Warehouse className="w-4 h-4" />
      case "land":
        return <TreePine className="w-4 h-4" />
      default:
        return <Building2 className="w-4 h-4" />
    }
  }

  const getBadgeColor = (badge: string) => {
    switch (badge.toLowerCase()) {
      case "verified":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "premium":
        return "bg-antique-gold/20 text-antique-gold border-antique-gold/30"
      case "exclusive":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      case "commercial":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      default:
        return "bg-olive-slate/20 text-olive-slate border-olive-slate/30"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-night via-forest-night/95 to-olive-slate/20">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-forest-night/80 border-b border-olive-slate/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-antique-gold" />
              <span className="text-xl font-bold text-ivory-mist">ProptyChain</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="/" className="text-ivory-mist/80 hover:text-antique-gold transition-colors">
                Home
              </a>
              <a href="/marketplace" className="text-antique-gold font-semibold">
                Marketplace
              </a>
              <a href="#" className="text-ivory-mist/80 hover:text-antique-gold transition-colors">
                Dashboard
              </a>
              <Button className="bg-antique-gold hover:bg-antique-gold/90 text-forest-night font-semibold">
                Connect Wallet
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-ivory-mist mb-4">Property Marketplace</h1>
            <p className="text-lg text-ivory-mist/70">
              Discover verified properties with NFT titles and community reviews
            </p>
          </div>

          {/* Filters */}
          <Card className="bg-forest-night/60 backdrop-blur-sm border-olive-slate/30 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ivory-mist/50 w-4 h-4" />
                  <Input
                    placeholder="Search by location, property ID, or owner..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-forest-night/40 border-olive-slate/30 text-ivory-mist placeholder:text-ivory-mist/50"
                  />
                </div>
              </div>

              {/* Property Type */}
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="bg-forest-night/40 border-olive-slate/30 text-ivory-mist">
                  <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent className="bg-forest-night border-olive-slate/30">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="villa">Villa</SelectItem>
                  <SelectItem value="penthouse">Penthouse</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="land">Land</SelectItem>
                </SelectContent>
              </Select>

              {/* Price Range */}
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="bg-forest-night/40 border-olive-slate/30 text-ivory-mist">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent className="bg-forest-night border-olive-slate/30">
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="0-100m">₦0 - ₦100M</SelectItem>
                  <SelectItem value="100m-300m">₦100M - ₦300M</SelectItem>
                  <SelectItem value="300m-500m">₦300M - ₦500M</SelectItem>
                  <SelectItem value="500m+">₦500M+</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort By */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="bg-forest-night/40 border-olive-slate/30 text-ivory-mist">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent className="bg-forest-night border-olive-slate/30">
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Results Count */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-ivory-mist/70">
              Showing <span className="text-antique-gold font-semibold">{properties.length}</span> properties
            </p>
            <Button
              variant="outline"
              className="border-olive-slate text-ivory-mist hover:bg-olive-slate/20 bg-transparent"
            >
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>

          {/* Property Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {properties.map((property) => (
              <Card
                key={property.id}
                className="bg-forest-night/60 backdrop-blur-sm border-olive-slate/30 overflow-hidden hover:bg-forest-night/80 transition-all duration-300 group cursor-pointer"
              >
                {/* Property Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={property.image || "/placeholder.svg"}
                    alt={property.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    {property.badges.map((badge) => (
                      <Badge key={badge} className={getBadgeColor(badge)}>
                        {badge}
                      </Badge>
                    ))}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-4 right-4 bg-forest-night/60 backdrop-blur-sm hover:bg-forest-night/80"
                  >
                    <Heart className="w-4 h-4 text-ivory-mist" />
                  </Button>
                </div>

                {/* Property Details */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    {getPropertyIcon(property.type)}
                    <span className="text-sm text-olive-slate">{property.type}</span>
                  </div>

                  <h3 className="text-lg font-semibold text-ivory-mist mb-2 group-hover:text-antique-gold transition-colors">
                    {property.title}
                  </h3>

                  <div className="flex items-center text-ivory-mist/70 mb-3">
                    <Building2 className="w-4 h-4 mr-1" />
                    <span className="text-sm">{property.location}</span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-antique-gold mr-1" />
                      <span className="text-sm text-ivory-mist">{property.rating}</span>
                      <span className="text-sm text-ivory-mist/60 ml-1">({property.reviews} reviews)</span>
                    </div>
                    <div className="text-xl font-bold text-antique-gold">{property.price}</div>
                  </div>

                  {/* Property Stats */}
                  <div className="flex justify-between text-sm text-ivory-mist/70 mb-4">
                    {property.bedrooms > 0 && <span>{property.bedrooms} bed</span>}
                    {property.bathrooms > 0 && <span>{property.bathrooms} bath</span>}
                    <span>{property.area}</span>
                  </div>

                  {/* Owner */}
                  <div className="flex items-center justify-between pt-4 border-t border-olive-slate/20">
                    <div className="text-xs text-ivory-mist/60">
                      Owner: <span className="text-antique-gold font-mono">{property.owner}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center">
            <Button size="lg" className="bg-antique-gold hover:bg-antique-gold/90 text-forest-night font-semibold px-8">
              Load More Properties
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
