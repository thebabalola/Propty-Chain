"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Building2,
  MapPin,
  Star,
  TrendingUp,
  CheckCircle,
  Crown,
  Users,
  MessageSquare,
  Calendar,
  Wallet,
  Upload,
  Settings,
} from "lucide-react"

// Mock user data
const user = {
  name: "John Adebayo",
  address: "0x1234...5678",
  avatar: "/placeholder.svg?height=80&width=80",
  reputation: 4.8,
  badges: ["Verified", "Premium Seller", "Top Rated", "Community Leader"],
  joinDate: "January 2023",
  role: "Property Owner",
  stats: {
    propertiesListed: 12,
    reviewsGiven: 28,
    transactionsCompleted: 15,
    totalEarnings: "₦2.4B",
  },
}

// Mock properties data
const userProperties = [
  {
    id: 1,
    title: "Luxury Villa in Victoria Island",
    location: "Victoria Island, Lagos",
    price: "₦450,000,000",
    status: "Active",
    views: 1247,
    inquiries: 23,
    image: "/modern-luxury-villa-pool.png",
    listedDate: "2024-01-15",
  },
  {
    id: 2,
    title: "Modern Apartment in Lekki",
    location: "Lekki Phase 1, Lagos",
    price: "₦85,000,000",
    status: "Sold",
    views: 892,
    inquiries: 15,
    image: "/placeholder-4v8i4.png",
    listedDate: "2023-12-10",
  },
  {
    id: 3,
    title: "Commercial Office Space",
    location: "Ikeja GRA, Lagos",
    price: "₦200,000,000",
    status: "Under Review",
    views: 456,
    inquiries: 8,
    image: "/modern-office-glass.png",
    listedDate: "2024-01-20",
  },
]

// Mock reviews data
const userReviews = [
  {
    id: 1,
    propertyTitle: "Waterfront Penthouse",
    rating: 5,
    content: "Amazing property with excellent amenities and great location.",
    date: "2024-01-18",
    status: "Published",
    helpful: 12,
  },
  {
    id: 2,
    propertyTitle: "Family House in Magodo",
    rating: 4,
    content: "Good property but could use some maintenance improvements.",
    date: "2024-01-10",
    status: "Published",
    helpful: 8,
  },
  {
    id: 3,
    propertyTitle: "Investment Land Plot",
    rating: 3,
    content: "Decent location but access road needs improvement.",
    date: "2024-01-05",
    status: "Under Review",
    helpful: 0,
  },
]

// Mock transactions data
const transactions = [
  {
    id: 1,
    type: "Sale",
    property: "Modern Apartment in Lekki",
    amount: "₦85,000,000",
    status: "Completed",
    date: "2024-01-12",
    buyer: "0x9876...4321",
  },
  {
    id: 2,
    type: "Purchase",
    property: "Commercial Office Space",
    amount: "₦200,000,000",
    status: "In Escrow",
    date: "2024-01-20",
    seller: "0x5555...9999",
  },
  {
    id: 3,
    type: "Sale",
    property: "Investment Land Plot",
    amount: "₦50,000,000",
    status: "Pending",
    date: "2024-01-22",
    buyer: "0x7777...3333",
  },
]

// Mock achievements data
const achievements = [
  {
    id: 1,
    name: "First Property",
    description: "List your first property on ProptyChain",
    icon: "🏠",
    unlocked: true,
    unlockedDate: "2023-01-15",
    rarity: "Common",
  },
  {
    id: 2,
    name: "Verified Seller",
    description: "Complete identity verification",
    icon: "✅",
    unlocked: true,
    unlockedDate: "2023-01-20",
    rarity: "Common",
  },
  {
    id: 3,
    name: "Top Rated",
    description: "Maintain 4.5+ rating with 10+ reviews",
    icon: "⭐",
    unlocked: true,
    unlockedDate: "2023-06-10",
    rarity: "Rare",
  },
  {
    id: 4,
    name: "Million Naira Club",
    description: "Complete transactions worth ₦1B+",
    icon: "💎",
    unlocked: true,
    unlockedDate: "2023-11-15",
    rarity: "Epic",
  },
  {
    id: 5,
    name: "Community Leader",
    description: "Help 100+ users with reviews and guidance",
    icon: "👑",
    unlocked: false,
    progress: 78,
    rarity: "Legendary",
  },
  {
    id: 6,
    name: "Property Mogul",
    description: "Own 20+ properties simultaneously",
    icon: "🏢",
    unlocked: false,
    progress: 60,
    rarity: "Legendary",
  },
]

// Mock subscription data
const subscription = {
  plan: "Premium",
  status: "Active",
  renewalDate: "2024-02-15",
  propertiesRemaining: 8,
  propertiesLimit: 15,
  featuresUsed: {
    premiumListings: 5,
    featuredPlacements: 2,
    analyticsReports: 12,
  },
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")

  const getBadgeColor = (badge: string) => {
    switch (badge.toLowerCase()) {
      case "verified":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "premium seller":
        return "bg-antique-gold/20 text-antique-gold border-antique-gold/30"
      case "top rated":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      case "community leader":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      default:
        return "bg-olive-slate/20 text-olive-slate border-olive-slate/30"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "published":
      case "completed":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "sold":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "under review":
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "in escrow":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30"
      default:
        return "bg-olive-slate/20 text-olive-slate border-olive-slate/30"
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case "common":
        return "text-gray-400"
      case "rare":
        return "text-blue-400"
      case "epic":
        return "text-purple-400"
      case "legendary":
        return "text-antique-gold"
      default:
        return "text-olive-slate"
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
              <a href="/dashboard" className="text-antique-gold font-semibold">
                Dashboard
              </a>
              <Button className="bg-antique-gold hover:bg-antique-gold/90 text-forest-night font-semibold">
                <Wallet className="w-4 h-4 mr-2" />
                Connected
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Profile Header */}
          <Card className="bg-forest-night/60 backdrop-blur-sm border-olive-slate/30 p-6 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <Avatar className="w-20 h-20">
                <AvatarImage src={user.avatar || "/placeholder.svg"} />
                <AvatarFallback className="bg-antique-gold text-forest-night text-2xl">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-ivory-mist">{user.name}</h1>
                  {user.badges.map((badge) => (
                    <Badge key={badge} className={getBadgeColor(badge)}>
                      {badge}
                    </Badge>
                  ))}
                </div>
                <p className="text-ivory-mist/70 font-mono mb-2">{user.address}</p>
                <div className="flex items-center space-x-4 text-sm text-ivory-mist/70">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-antique-gold mr-1" />
                    {user.reputation} reputation
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Joined {user.joinDate}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {user.role}
                  </div>
                </div>
              </div>
              <Button className="bg-antique-gold hover:bg-antique-gold/90 text-forest-night font-semibold">
                <Settings className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </Card>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-forest-night/60 backdrop-blur-sm border-olive-slate/30 p-4 text-center">
              <Building2 className="w-8 h-8 text-antique-gold mx-auto mb-2" />
              <div className="text-2xl font-bold text-ivory-mist">{user.stats.propertiesListed}</div>
              <div className="text-sm text-ivory-mist/70">Properties Listed</div>
            </Card>
            <Card className="bg-forest-night/60 backdrop-blur-sm border-olive-slate/30 p-4 text-center">
              <MessageSquare className="w-8 h-8 text-antique-gold mx-auto mb-2" />
              <div className="text-2xl font-bold text-ivory-mist">{user.stats.reviewsGiven}</div>
              <div className="text-sm text-ivory-mist/70">Reviews Given</div>
            </Card>
            <Card className="bg-forest-night/60 backdrop-blur-sm border-olive-slate/30 p-4 text-center">
              <CheckCircle className="w-8 h-8 text-antique-gold mx-auto mb-2" />
              <div className="text-2xl font-bold text-ivory-mist">{user.stats.transactionsCompleted}</div>
              <div className="text-sm text-ivory-mist/70">Transactions</div>
            </Card>
            <Card className="bg-forest-night/60 backdrop-blur-sm border-olive-slate/30 p-4 text-center">
              <TrendingUp className="w-8 h-8 text-antique-gold mx-auto mb-2" />
              <div className="text-2xl font-bold text-ivory-mist">{user.stats.totalEarnings}</div>
              <div className="text-sm text-ivory-mist/70">Total Volume</div>
            </Card>
          </div>

          {/* Dashboard Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-forest-night/60 backdrop-blur-sm border-olive-slate/30 mb-6">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-antique-gold data-[state=active]:text-forest-night"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="properties"
                className="data-[state=active]:bg-antique-gold data-[state=active]:text-forest-night"
              >
                My Properties
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="data-[state=active]:bg-antique-gold data-[state=active]:text-forest-night"
              >
                My Reviews
              </TabsTrigger>
              <TabsTrigger
                value="transactions"
                className="data-[state=active]:bg-antique-gold data-[state=active]:text-forest-night"
              >
                Transactions
              </TabsTrigger>
              <TabsTrigger
                value="achievements"
                className="data-[state=active]:bg-antique-gold data-[state=active]:text-forest-night"
              >
                Achievements
              </TabsTrigger>
              <TabsTrigger
                value="subscription"
                className="data-[state=active]:bg-antique-gold data-[state=active]:text-forest-night"
              >
                Subscription
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="bg-forest-night/60 backdrop-blur-sm border-olive-slate/30 p-6">
                  <h3 className="text-lg font-semibold text-ivory-mist mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                                            <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-green-400 rounded-full" />
                          <span className="text-ivory-mist/80">Property &quot;Luxury Villa&quot; received 5 new inquiries</span>
                          <span className="text-xs text-ivory-mist/60">2h ago</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-blue-400 rounded-full" />
                          <span className="text-ivory-mist/80">Review published for &quot;Waterfront Penthouse&quot;</span>
                          <span className="text-xs text-ivory-mist/60">1d ago</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-antique-gold rounded-full" />
                          <span className="text-ivory-mist/80">Earned &quot;Top Rated&quot; achievement badge</span>
                          <span className="text-xs text-ivory-mist/60">3d ago</span>
                        </div>
                  </div>
                </Card>

                <Card className="bg-forest-night/60 backdrop-blur-sm border-olive-slate/30 p-6">
                  <h3 className="text-lg font-semibold text-ivory-mist mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Button className="bg-antique-gold hover:bg-antique-gold/90 text-forest-night font-semibold">
                      <Upload className="w-4 h-4 mr-2" />
                      List Property
                    </Button>
                    <Button
                      variant="outline"
                      className="border-olive-slate text-ivory-mist hover:bg-olive-slate/20 bg-transparent"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Write Review
                    </Button>
                                            <Button
                          variant="outline"
                          className="border-olive-slate text-ivory-mist hover:bg-olive-slate/20 bg-transparent"
                        >
                          <Building2 className="w-4 h-4 mr-2" />
                          Browse Market
                        </Button>
                    <Button
                      variant="outline"
                      className="border-olive-slate text-ivory-mist hover:bg-olive-slate/20 bg-transparent"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Button>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="properties">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-ivory-mist">My Properties</h3>
                  <Button className="bg-antique-gold hover:bg-antique-gold/90 text-forest-night font-semibold">
                    <Upload className="w-4 h-4 mr-2" />
                    Add Property
                  </Button>
                </div>
                {userProperties.map((property) => (
                  <Card key={property.id} className="bg-forest-night/60 backdrop-blur-sm border-olive-slate/30 p-6">
                    <div className="flex items-center space-x-4">
                      <img
                        src={property.image || "/placeholder.svg"}
                        alt={property.title}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-lg font-semibold text-ivory-mist">{property.title}</h4>
                          <Badge className={getStatusColor(property.status)}>{property.status}</Badge>
                        </div>
                        <div className="flex items-center text-ivory-mist/70 mb-2">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span className="text-sm">{property.location}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-xl font-bold text-antique-gold">{property.price}</div>
                          <div className="flex items-center space-x-4 text-sm text-ivory-mist/70">
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              {property.views} views
                            </div>
                            <div className="flex items-center">
                              <MessageSquare className="w-4 h-4 mr-1" />
                              {property.inquiries} inquiries
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="ghost" className="text-ivory-mist hover:bg-forest-night/40">
                          <Users className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-ivory-mist hover:bg-forest-night/40">
                          <Settings className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-red-400 hover:bg-red-500/20">
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reviews">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-ivory-mist">My Reviews</h3>
                {userReviews.map((review) => (
                  <Card key={review.id} className="bg-forest-night/60 backdrop-blur-sm border-olive-slate/30 p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-lg font-semibold text-ivory-mist">{review.propertyTitle}</h4>
                          <Badge className={getStatusColor(review.status)}>{review.status}</Badge>
                        </div>
                        <div className="flex items-center mb-2">
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
                        <p className="text-ivory-mist/80 mb-2">{review.content.replace(/'/g, "&apos;")}</p>
                        <div className="text-sm text-ivory-mist/70">{review.helpful} people found this helpful</div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="transactions">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-ivory-mist">Transaction History</h3>
                {transactions.map((transaction) => (
                  <Card key={transaction.id} className="bg-forest-night/60 backdrop-blur-sm border-olive-slate/30 p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-lg font-semibold text-ivory-mist">{transaction.property}</h4>
                          <Badge className={getStatusColor(transaction.status)}>{transaction.status}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-ivory-mist/70">
                            {transaction.type} • {transaction.date}
                          </div>
                          <div className="text-xl font-bold text-antique-gold">{transaction.amount}</div>
                        </div>
                        <div className="text-sm text-ivory-mist/70 mt-1">
                          {transaction.type === "Sale" ? "Buyer" : "Seller"}:{" "}
                          <span className="font-mono">
                            {transaction.type === "Sale" ? transaction.buyer : transaction.seller}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="achievements">
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-ivory-mist">Achievement Badges</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {achievements.map((achievement) => (
                    <Card
                      key={achievement.id}
                      className={`bg-forest-night/60 backdrop-blur-sm border-olive-slate/30 p-6 ${
                        achievement.unlocked ? "opacity-100" : "opacity-60"
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="text-4xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-lg font-semibold text-ivory-mist">{achievement.name}</h4>
                            <span className={`text-sm font-semibold ${getRarityColor(achievement.rarity)}`}>
                              {achievement.rarity}
                            </span>
                          </div>
                          <p className="text-ivory-mist/70 mb-3">{achievement.description}</p>
                          {achievement.unlocked ? (
                            <div className="flex items-center text-sm text-green-400">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Unlocked {achievement.unlockedDate}
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm text-ivory-mist/70">
                                <span>Progress</span>
                                <span>{achievement.progress}%</span>
                              </div>
                              <Progress value={achievement.progress} className="h-2" />
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="subscription">
              <div className="space-y-6">
                <Card className="bg-forest-night/60 backdrop-blur-sm border-olive-slate/30 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-ivory-mist">Current Plan</h3>
                    <Badge className="bg-antique-gold/20 text-antique-gold border-antique-gold/30">
                      <Crown className="w-4 h-4 mr-1" />
                      {subscription.plan}
                    </Badge>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div>
                      <div className="text-2xl font-bold text-ivory-mist">{subscription.propertiesRemaining}</div>
                      <div className="text-sm text-ivory-mist/70">Properties Remaining</div>
                      <Progress
                        value={(subscription.propertiesRemaining / subscription.propertiesLimit) * 100}
                        className="mt-2 h-2"
                      />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-ivory-mist">{subscription.status}</div>
                      <div className="text-sm text-ivory-mist/70">Status</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-ivory-mist">{subscription.renewalDate}</div>
                      <div className="text-sm text-ivory-mist/70">Next Renewal</div>
                    </div>
                  </div>
                  <Button className="bg-antique-gold hover:bg-antique-gold/90 text-forest-night font-semibold">
                    Upgrade Plan
                  </Button>
                </Card>

                <Card className="bg-forest-night/60 backdrop-blur-sm border-olive-slate/30 p-6">
                  <h3 className="text-lg font-semibold text-ivory-mist mb-4">Usage Statistics</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-xl font-bold text-ivory-mist">
                        {subscription.featuresUsed.premiumListings}
                      </div>
                      <div className="text-sm text-ivory-mist/70">Premium Listings</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-ivory-mist">
                        {subscription.featuresUsed.featuredPlacements}
                      </div>
                      <div className="text-sm text-ivory-mist/70">Featured Placements</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-ivory-mist">
                        {subscription.featuresUsed.analyticsReports}
                      </div>
                      <div className="text-sm text-ivory-mist/70">Analytics Reports</div>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
