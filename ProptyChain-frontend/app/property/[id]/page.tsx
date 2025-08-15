"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Building2,
  MapPin,
  Star,
  Heart,
  Share2,
  MessageCircle,
  Flag,
  Calendar,
  Bed,
  Bath,
  Square,
  Shield,
  ChevronLeft,
  ChevronRight,
  Send,
  ThumbsUp,
} from "lucide-react"

// Mock property data
const property = {
  id: 1,
  title: "Luxury Villa in Victoria Island",
  location: "Victoria Island, Lagos",
  price: "₦450,000,000",
  type: "Villa",
  rating: 4.8,
  reviews: 24,
  images: [
    "/modern-luxury-villa-pool.png",
    "/luxury-penthouse-ocean-view.png",
    "/family-house-garden-driveway.png",
    "/modern-office-glass.png",
  ],
  owner: {
    address: "0x1234...5678",
    name: "John Adebayo",
    avatar: "/placeholder.svg?height=40&width=40",
    reputation: 4.9,
    badges: ["Verified", "Premium Seller", "Top Rated"],
    properties: 12,
    joinDate: "2023",
  },
  badges: ["Verified", "Premium"],
  bedrooms: 5,
  bathrooms: 4,
  area: "650 sqm",
  yearBuilt: 2021,
  description:
    "Stunning luxury villa located in the heart of Victoria Island. This magnificent property features modern architecture, premium finishes, and breathtaking views. Perfect for families seeking luxury living in Lagos' most prestigious neighborhood.",
  features: [
    "Swimming Pool",
    "Private Garden",
    "24/7 Security",
    "Parking for 4 cars",
    "Modern Kitchen",
    "Air Conditioning",
    "Generator",
    "CCTV System",
  ],
  nftDetails: {
    tokenId: "#VIL001",
    blockchain: "Base",
    mintDate: "2024-01-15",
    lastTransfer: "2024-01-15",
  },
}

// Mock reviews data
const reviews = [
  {
    id: 1,
    user: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=32&width=32",
      address: "0x9876...4321",
      badges: ["Verified Resident"],
    },
    rating: 5,
    category: "Resident",
    date: "2024-01-20",
    content:
      "Amazing property! The location is perfect and the amenities are top-notch. The security is excellent and the neighborhood is very safe. Highly recommend!",
    helpful: 12,
    images: ["/family-house-garden-driveway.png"],
  },
  {
    id: 2,
    user: {
      name: "Michael Chen",
      avatar: "/placeholder.svg?height=32&width=32",
      address: "0x5555...9999",
      badges: ["Community Member"],
    },
    rating: 4,
    category: "Community",
    date: "2024-01-18",
    content:
      "Great area with good infrastructure. The property looks well-maintained from the outside. Traffic can be a bit heavy during peak hours.",
    helpful: 8,
    images: [],
  },
  {
    id: 3,
    user: {
      name: "Fatima Abdullahi",
      avatar: "/placeholder.svg?height=32&width=32",
      address: "0x7777...3333",
      badges: ["Former Tenant"],
    },
    rating: 5,
    category: "Tenant",
    date: "2024-01-15",
    content:
      "Lived here for 2 years. Excellent property with responsive management. All amenities work perfectly and the location is unbeatable.",
    helpful: 15,
    images: [],
  },
]

export default function PropertyDetailsPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [newReview, setNewReview] = useState("")
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewCategory, setReviewCategory] = useState("community")

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length)
  }

  const getBadgeColor = (badge: string) => {
    switch (badge.toLowerCase()) {
      case "verified":
      case "verified resident":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "premium":
      case "premium seller":
        return "bg-antique-gold/20 text-antique-gold border-antique-gold/30"
      case "top rated":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      case "former tenant":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "community member":
        return "bg-olive-slate/20 text-olive-slate border-olive-slate/30"
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
              <a href="/marketplace" className="text-ivory-mist/80 hover:text-antique-gold transition-colors">
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
          {/* Property Gallery */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Main Image */}
            <div className="relative">
              <Card className="overflow-hidden bg-forest-night/60 backdrop-blur-sm border-olive-slate/30">
                <div className="relative h-96 lg:h-[500px]">
                  <img
                    src={property.images[currentImageIndex] || "/placeholder.svg"}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-forest-night/60 backdrop-blur-sm hover:bg-forest-night/80"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="w-4 h-4 text-ivory-mist" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-forest-night/60 backdrop-blur-sm hover:bg-forest-night/80"
                    onClick={nextImage}
                  >
                    <ChevronRight className="w-4 h-4 text-ivory-mist" />
                  </Button>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {property.images.map((_, index) => (
                      <button
                        key={index}
                        className={`w-2 h-2 rounded-full ${
                          index === currentImageIndex ? "bg-antique-gold" : "bg-ivory-mist/50"
                        }`}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                </div>
              </Card>

              {/* Thumbnail Images */}
              <div className="grid grid-cols-4 gap-2 mt-4">
                {property.images.map((image, index) => (
                  <button
                    key={index}
                    className={`relative h-20 rounded-lg overflow-hidden border-2 ${
                      index === currentImageIndex ? "border-antique-gold" : "border-olive-slate/30"
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`View ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Property Info */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                {property.badges.map((badge) => (
                  <Badge key={badge} className={getBadgeColor(badge)}>
                    {badge}
                  </Badge>
                ))}
              </div>

              <h1 className="text-3xl font-bold text-ivory-mist mb-2">{property.title}</h1>

              <div className="flex items-center text-ivory-mist/70 mb-4">
                <MapPin className="w-5 h-5 mr-2" />
                <span className="text-lg">{property.location}</span>
              </div>

              <div className="flex items-center justify-between mb-6">
                <div className="text-3xl font-bold text-antique-gold">{property.price}</div>
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-antique-gold mr-1" />
                  <span className="text-lg text-ivory-mist">{property.rating}</span>
                  <span className="text-ivory-mist/60 ml-1">({property.reviews} reviews)</span>
                </div>
              </div>

              {/* Property Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <Card className="bg-forest-night/40 backdrop-blur-sm border-olive-slate/30 p-4 text-center">
                  <Bed className="w-6 h-6 text-antique-gold mx-auto mb-2" />
                  <div className="text-lg font-semibold text-ivory-mist">{property.bedrooms}</div>
                  <div className="text-sm text-ivory-mist/70">Bedrooms</div>
                </Card>
                <Card className="bg-forest-night/40 backdrop-blur-sm border-olive-slate/30 p-4 text-center">
                  <Bath className="w-6 h-6 text-antique-gold mx-auto mb-2" />
                  <div className="text-lg font-semibold text-ivory-mist">{property.bathrooms}</div>
                  <div className="text-sm text-ivory-mist/70">Bathrooms</div>
                </Card>
                <Card className="bg-forest-night/40 backdrop-blur-sm border-olive-slate/30 p-4 text-center">
                  <Square className="w-6 h-6 text-antique-gold mx-auto mb-2" />
                  <div className="text-lg font-semibold text-ivory-mist">{property.area}</div>
                  <div className="text-sm text-ivory-mist/70">Area</div>
                </Card>
                <Card className="bg-forest-night/40 backdrop-blur-sm border-olive-slate/30 p-4 text-center">
                  <Calendar className="w-6 h-6 text-antique-gold mx-auto mb-2" />
                  <div className="text-lg font-semibold text-ivory-mist">{property.yearBuilt}</div>
                  <div className="text-sm text-ivory-mist/70">Built</div>
                </Card>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <Button size="lg" className="bg-antique-gold hover:bg-antique-gold/90 text-forest-night font-semibold">
                  Make Offer
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-olive-slate text-ivory-mist hover:bg-olive-slate/20 bg-transparent"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contact Owner
                </Button>
                <Button size="lg" variant="ghost" className="text-ivory-mist hover:bg-forest-night/40">
                  <Heart className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button size="lg" variant="ghost" className="text-ivory-mist hover:bg-forest-night/40">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>

              {/* NFT Details */}
              <Card className="bg-forest-night/40 backdrop-blur-sm border-olive-slate/30 p-4">
                <h3 className="text-lg font-semibold text-ivory-mist mb-3 flex items-center">
                  <Shield className="w-5 h-5 text-antique-gold mr-2" />
                  NFT Property Title
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-ivory-mist/70">Token ID:</span>
                    <div className="text-antique-gold font-mono">{property.nftDetails.tokenId}</div>
                  </div>
                  <div>
                    <span className="text-ivory-mist/70">Blockchain:</span>
                    <div className="text-ivory-mist">{property.nftDetails.blockchain}</div>
                  </div>
                  <div>
                    <span className="text-ivory-mist/70">Mint Date:</span>
                    <div className="text-ivory-mist">{property.nftDetails.mintDate}</div>
                  </div>
                  <div>
                    <span className="text-ivory-mist/70">Last Transfer:</span>
                    <div className="text-ivory-mist">{property.nftDetails.lastTransfer}</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Property Details Tabs */}
          <Tabs defaultValue="description" className="mb-8">
            <TabsList className="bg-forest-night/60 backdrop-blur-sm border-olive-slate/30">
              <TabsTrigger
                value="description"
                className="data-[state=active]:bg-antique-gold data-[state=active]:text-forest-night"
              >
                Description
              </TabsTrigger>
              <TabsTrigger
                value="features"
                className="data-[state=active]:bg-antique-gold data-[state=active]:text-forest-night"
              >
                Features
              </TabsTrigger>
              <TabsTrigger
                value="owner"
                className="data-[state=active]:bg-antique-gold data-[state=active]:text-forest-night"
              >
                Owner
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="data-[state=active]:bg-antique-gold data-[state=active]:text-forest-night"
              >
                Reviews ({property.reviews})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description">
              <Card className="bg-forest-night/60 backdrop-blur-sm border-olive-slate/30 p-6">
                <p className="text-ivory-mist/80 leading-relaxed">{property.description}</p>
              </Card>
            </TabsContent>

            <TabsContent value="features">
              <Card className="bg-forest-night/60 backdrop-blur-sm border-olive-slate/30 p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-ivory-mist">
                      <div className="w-2 h-2 bg-antique-gold rounded-full mr-3" />
                      {feature}
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="owner">
              <Card className="bg-forest-night/60 backdrop-blur-sm border-olive-slate/30 p-6">
                <div className="flex items-start space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={property.owner.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-antique-gold text-forest-night">
                      {property.owner.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold text-ivory-mist">{property.owner.name}</h3>
                      {property.owner.badges.map((badge) => (
                        <Badge key={badge} className={getBadgeColor(badge)}>
                          {badge}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm text-ivory-mist/70 font-mono mb-2">{property.owner.address}</p>
                    <div className="flex items-center space-x-4 text-sm text-ivory-mist/70">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-antique-gold mr-1" />
                        {property.owner.reputation} rating
                      </div>
                      <div>{property.owner.properties} properties</div>
                      <div>Joined {property.owner.joinDate}</div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="reviews">
              <div className="space-y-6">
                {/* Write Review */}
                <Card className="bg-forest-night/60 backdrop-blur-sm border-olive-slate/30 p-6">
                  <h3 className="text-lg font-semibold text-ivory-mist mb-4">Write a Review</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <Select value={reviewCategory} onValueChange={setReviewCategory}>
                      <SelectTrigger className="bg-forest-night/40 border-olive-slate/30 text-ivory-mist">
                        <SelectValue placeholder="Review Category" />
                      </SelectTrigger>
                      <SelectContent className="bg-forest-night border-olive-slate/30">
                        <SelectItem value="resident">Resident</SelectItem>
                        <SelectItem value="tenant">Former Tenant</SelectItem>
                        <SelectItem value="community">Community Member</SelectItem>
                        <SelectItem value="visitor">Visitor</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex items-center space-x-2">
                      <span className="text-ivory-mist/70">Rating:</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setReviewRating(star)}
                            className={`w-6 h-6 ${star <= reviewRating ? "text-antique-gold" : "text-ivory-mist/30"}`}
                          >
                            <Star className="w-full h-full fill-current" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <Textarea
                    placeholder="Share your experience with this property..."
                    value={newReview}
                    onChange={(e) => setNewReview(e.target.value)}
                    className="bg-forest-night/40 border-olive-slate/30 text-ivory-mist placeholder:text-ivory-mist/50 mb-4"
                    rows={4}
                  />
                  <Button className="bg-antique-gold hover:bg-antique-gold/90 text-forest-night font-semibold">
                    <Send className="w-4 h-4 mr-2" />
                    Submit Review
                  </Button>
                </Card>

                {/* Reviews List */}
                {reviews.map((review) => (
                  <Card key={review.id} className="bg-forest-night/60 backdrop-blur-sm border-olive-slate/30 p-6">
                    <div className="flex items-start space-x-4">
                      <Avatar>
                        <AvatarImage src={review.user.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="bg-antique-gold text-forest-night">
                          {review.user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-ivory-mist">{review.user.name}</h4>
                            {review.user.badges.map((badge) => (
                              <Badge key={badge} className={getBadgeColor(badge)}>
                                {badge}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center">
                            <div className="flex mr-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= review.rating ? "text-antique-gold fill-current" : "text-ivory-mist/30"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-ivory-mist/70">{review.date}</span>
                          </div>
                        </div>
                        <p className="text-ivory-mist/80 mb-3">{review.content}</p>
                        {review.images.length > 0 && (
                          <div className="flex space-x-2 mb-3">
                            {review.images.map((image, index) => (
                              <img
                                key={index}
                                src={image || "/placeholder.svg"}
                                alt={`Review image ${index + 1}`}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                            ))}
                          </div>
                        )}
                        <div className="flex items-center space-x-4 text-sm">
                          <button className="flex items-center text-ivory-mist/70 hover:text-antique-gold">
                            <ThumbsUp className="w-4 h-4 mr-1" />
                            Helpful ({review.helpful})
                          </button>
                          <button className="flex items-center text-ivory-mist/70 hover:text-red-400">
                            <Flag className="w-4 h-4 mr-1" />
                            Report
                          </button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
