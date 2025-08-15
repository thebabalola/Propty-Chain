"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Building2,
  Search,
  Filter,
  CheckCircle,
  Lock,
  Star,
  Crown,
  Trophy,
  Users,
  TrendingUp,
  Calendar,
  Award,
  Zap,
} from "lucide-react"

// Mock badges data with comprehensive gamification system
const allBadges = [
  // Starter Badges
  {
    id: 1,
    name: "Welcome to ProptyChain",
    description: "Complete your profile setup and wallet connection",
    icon: "👋",
    category: "Getting Started",
    rarity: "Common",
    points: 10,
    unlocked: true,
    unlockedDate: "2023-01-15",
    requirements: ["Connect wallet", "Complete profile", "Verify email"],
    holders: 15293,
    percentage: 98.5,
  },
  {
    id: 2,
    name: "First Steps",
    description: "Browse the marketplace and view your first property",
    icon: "👶",
    category: "Getting Started",
    rarity: "Common",
    points: 15,
    unlocked: true,
    unlockedDate: "2023-01-16",
    requirements: ["View 5 properties", "Use search filters", "Save a property"],
    holders: 14892,
    percentage: 95.8,
  },
  {
    id: 3,
    name: "Property Explorer",
    description: "View 50+ properties across different locations",
    icon: "🔍",
    category: "Exploration",
    rarity: "Common",
    points: 25,
    unlocked: true,
    unlockedDate: "2023-02-10",
    requirements: ["View 50 properties", "Visit 5 different locations", "Use advanced filters"],
    holders: 12456,
    percentage: 80.2,
  },

  // Property Owner Badges
  {
    id: 4,
    name: "First Property",
    description: "List your first property on ProptyChain",
    icon: "🏠",
    category: "Property Owner",
    rarity: "Uncommon",
    points: 50,
    unlocked: true,
    unlockedDate: "2023-01-20",
    requirements: ["List first property", "Complete property verification", "Add property photos"],
    holders: 8934,
    percentage: 57.5,
  },
  {
    id: 5,
    name: "Property Portfolio",
    description: "Own 5+ active property listings simultaneously",
    icon: "🏢",
    category: "Property Owner",
    rarity: "Rare",
    points: 100,
    unlocked: true,
    unlockedDate: "2023-06-15",
    requirements: ["5 active listings", "Maintain 4.0+ rating", "Complete 2+ transactions"],
    holders: 3421,
    percentage: 22.0,
  },
  {
    id: 6,
    name: "Property Mogul",
    description: "Own 20+ properties simultaneously",
    icon: "🏰",
    category: "Property Owner",
    rarity: "Epic",
    points: 250,
    unlocked: false,
    progress: 60,
    requirements: ["20 active listings", "₦1B+ total value", "Maintain 4.5+ rating"],
    holders: 234,
    percentage: 1.5,
  },

  // Community Badges
  {
    id: 7,
    name: "Helpful Reviewer",
    description: "Write 10 helpful property reviews",
    icon: "📝",
    category: "Community",
    rarity: "Uncommon",
    points: 40,
    unlocked: true,
    unlockedDate: "2023-03-22",
    requirements: ["Write 10 reviews", "Receive 50+ helpful votes", "Maintain quality score"],
    holders: 5678,
    percentage: 36.5,
  },
  {
    id: 8,
    name: "Community Leader",
    description: "Help 100+ users with reviews and guidance",
    icon: "👑",
    category: "Community",
    rarity: "Legendary",
    points: 500,
    unlocked: false,
    progress: 78,
    requirements: ["Help 100+ users", "Write 50+ reviews", "Mentor new users"],
    holders: 89,
    percentage: 0.6,
  },
  {
    id: 9,
    name: "Trusted Voice",
    description: "Receive 500+ helpful votes on your reviews",
    icon: "🎯",
    category: "Community",
    rarity: "Rare",
    points: 150,
    unlocked: false,
    progress: 45,
    requirements: ["500+ helpful votes", "4.5+ review rating", "Active for 6+ months"],
    holders: 892,
    percentage: 5.7,
  },

  // Transaction Badges
  {
    id: 10,
    name: "First Transaction",
    description: "Complete your first property transaction",
    icon: "💰",
    category: "Transactions",
    rarity: "Uncommon",
    points: 75,
    unlocked: true,
    unlockedDate: "2023-04-10",
    requirements: ["Complete first transaction", "Use smart contract escrow", "Leave transaction review"],
    holders: 6789,
    percentage: 43.7,
  },
  {
    id: 11,
    name: "Million Naira Club",
    description: "Complete transactions worth ₦1B+ total",
    icon: "💎",
    category: "Transactions",
    rarity: "Epic",
    points: 300,
    unlocked: true,
    unlockedDate: "2023-11-15",
    requirements: ["₦1B+ transaction volume", "Complete 10+ transactions", "Maintain good standing"],
    holders: 456,
    percentage: 2.9,
  },
  {
    id: 12,
    name: "Billion Naira Elite",
    description: "Complete transactions worth ₦10B+ total",
    icon: "👑",
    category: "Transactions",
    rarity: "Legendary",
    points: 1000,
    unlocked: false,
    progress: 25,
    requirements: ["₦10B+ transaction volume", "50+ transactions", "VIP status"],
    holders: 23,
    percentage: 0.1,
  },

  // Special Achievement Badges
  {
    id: 13,
    name: "Early Adopter",
    description: "Joined ProptyChain in the first 1000 users",
    icon: "🚀",
    category: "Special",
    rarity: "Legendary",
    points: 750,
    unlocked: true,
    unlockedDate: "2023-01-15",
    requirements: ["Join in first 1000 users", "Complete onboarding", "Make first transaction"],
    holders: 1000,
    percentage: 6.4,
  },
  {
    id: 14,
    name: "Beta Tester",
    description: "Participated in ProptyChain beta testing",
    icon: "🧪",
    category: "Special",
    rarity: "Epic",
    points: 200,
    unlocked: false,
    progress: 0,
    requirements: ["Participate in beta", "Submit feedback", "Report bugs"],
    holders: 156,
    percentage: 1.0,
  },
  {
    id: 15,
    name: "Top Rated Seller",
    description: "Maintain 4.8+ rating with 50+ reviews",
    icon: "⭐",
    category: "Reputation",
    rarity: "Rare",
    points: 125,
    unlocked: true,
    unlockedDate: "2023-08-20",
    requirements: ["4.8+ rating", "50+ reviews", "Active for 6+ months"],
    holders: 1234,
    percentage: 7.9,
  },
]

export default function BadgesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedRarity, setSelectedRarity] = useState("all")
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(false)

  const categories = ["all", "Getting Started", "Property Owner", "Community", "Transactions", "Special", "Reputation"]
  const rarities = ["all", "Common", "Uncommon", "Rare", "Epic", "Legendary"]

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case "common":
        return "text-gray-400 border-gray-400/30 bg-gray-400/10"
      case "uncommon":
        return "text-green-400 border-green-400/30 bg-green-400/10"
      case "rare":
        return "text-blue-400 border-blue-400/30 bg-blue-400/10"
      case "epic":
        return "text-purple-400 border-purple-400/30 bg-purple-400/10"
      case "legendary":
        return "text-antique-gold border-antique-gold/30 bg-antique-gold/10"
      default:
        return "text-olive-slate border-olive-slate/30 bg-olive-slate/10"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "getting started":
        return <Zap className="w-5 h-5" />
      case "property owner":
        return <Building2 className="w-5 h-5" />
      case "community":
        return <Users className="w-5 h-5" />
      case "transactions":
        return <TrendingUp className="w-5 h-5" />
      case "special":
        return <Crown className="w-5 h-5" />
      case "reputation":
        return <Star className="w-5 h-5" />
      default:
        return <Award className="w-5 h-5" />
    }
  }

  const filteredBadges = allBadges.filter((badge) => {
    const matchesSearch =
      badge.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      badge.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || badge.category === selectedCategory
    const matchesRarity = selectedRarity === "all" || badge.rarity === selectedRarity
    const matchesUnlocked = !showUnlockedOnly || badge.unlocked

    return matchesSearch && matchesCategory && matchesRarity && matchesUnlocked
  })

  const userStats = {
    totalBadges: allBadges.length,
    unlockedBadges: allBadges.filter((b) => b.unlocked).length,
    totalPoints: allBadges.filter((b) => b.unlocked).reduce((sum, b) => sum + b.points, 0),
    rank: "Gold Tier",
    nextRankPoints: 2500,
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
              <a href="/dashboard" className="text-ivory-mist/80 hover:text-antique-gold transition-colors">
                Dashboard
              </a>
              <a href="/badges" className="text-antique-gold font-semibold">
                Badges
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
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-ivory-mist mb-4">Achievement Badges</h1>
            <p className="text-lg text-ivory-mist/70 max-w-2xl mx-auto">
              Earn Soulbound NFT badges by contributing to the ProptyChain ecosystem and unlock exclusive rewards
            </p>
          </div>

          {/* User Stats */}
          <Card className="bg-forest-night/60 backdrop-blur-sm border-olive-slate/30 p-6 mb-8">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-antique-gold">{userStats.unlockedBadges}</div>
                <div className="text-sm text-ivory-mist/70">Badges Earned</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-ivory-mist">{userStats.totalBadges}</div>
                <div className="text-sm text-ivory-mist/70">Total Available</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-antique-gold">{userStats.totalPoints}</div>
                <div className="text-sm text-ivory-mist/70">Achievement Points</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{userStats.rank}</div>
                <div className="text-sm text-ivory-mist/70">Current Rank</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-ivory-mist">{userStats.nextRankPoints}</div>
                <div className="text-sm text-ivory-mist/70">Next Rank Points</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm text-ivory-mist/70 mb-2">
                <span>Progress to Diamond Tier</span>
                <span>{Math.round((userStats.totalPoints / userStats.nextRankPoints) * 100)}%</span>
              </div>
              <Progress value={(userStats.totalPoints / userStats.nextRankPoints) * 100} className="h-3" />
            </div>
          </Card>

          {/* Filters */}
          <Card className="bg-forest-night/60 backdrop-blur-sm border-olive-slate/30 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ivory-mist/50 w-4 h-4" />
                  <Input
                    placeholder="Search badges..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-forest-night/40 border-olive-slate/30 text-ivory-mist placeholder:text-ivory-mist/50"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-forest-night/40 border-olive-slate/30 text-ivory-mist">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-forest-night border-olive-slate/30">
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Rarity Filter */}
              <Select value={selectedRarity} onValueChange={setSelectedRarity}>
                <SelectTrigger className="bg-forest-night/40 border-olive-slate/30 text-ivory-mist">
                  <SelectValue placeholder="Rarity" />
                </SelectTrigger>
                <SelectContent className="bg-forest-night border-olive-slate/30">
                  {rarities.map((rarity) => (
                    <SelectItem key={rarity} value={rarity}>
                      {rarity === "all" ? "All Rarities" : rarity}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Show Unlocked Only */}
              <Button
                variant={showUnlockedOnly ? "default" : "outline"}
                onClick={() => setShowUnlockedOnly(!showUnlockedOnly)}
                className={
                  showUnlockedOnly
                    ? "bg-antique-gold hover:bg-antique-gold/90 text-forest-night"
                    : "border-olive-slate text-ivory-mist hover:bg-olive-slate/20 bg-transparent"
                }
              >
                <Filter className="w-4 h-4 mr-2" />
                {showUnlockedOnly ? "Unlocked Only" : "All Badges"}
              </Button>
            </div>
          </Card>

          {/* Results Count */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-ivory-mist/70">
              Showing <span className="text-antique-gold font-semibold">{filteredBadges.length}</span> badges
            </p>
          </div>

          {/* Badges Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBadges.map((badge) => (
              <Card
                key={badge.id}
                className={`bg-forest-night/60 backdrop-blur-sm border-olive-slate/30 p-6 transition-all duration-300 hover:bg-forest-night/80 ${
                  badge.unlocked ? "opacity-100" : "opacity-75"
                }`}
              >
                {/* Badge Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{badge.icon}</div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge className={getRarityColor(badge.rarity)}>{badge.rarity}</Badge>
                    {badge.unlocked ? (
                      <div className="flex items-center text-green-400">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        <span className="text-xs">Unlocked</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-ivory-mist/50">
                        <Lock className="w-4 h-4 mr-1" />
                        <span className="text-xs">Locked</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Badge Info */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    {getCategoryIcon(badge.category)}
                    <h3 className="text-lg font-semibold text-ivory-mist">{badge.name}</h3>
                  </div>
                  <p className="text-ivory-mist/70 text-sm mb-3">{badge.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-ivory-mist/60">{badge.category}</span>
                    <span className="text-antique-gold font-semibold">{badge.points} pts</span>
                  </div>
                </div>

                {/* Progress or Unlock Date */}
                {badge.unlocked ? (
                  <div className="text-sm text-green-400 mb-4">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Unlocked {badge.unlockedDate}
                  </div>
                ) : badge.progress !== undefined ? (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-ivory-mist/70 mb-2">
                      <span>Progress</span>
                      <span>{badge.progress}%</span>
                    </div>
                    <Progress value={badge.progress} className="h-2" />
                  </div>
                ) : null}

                {/* Requirements */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-ivory-mist mb-2">Requirements:</h4>
                  <ul className="text-xs text-ivory-mist/70 space-y-1">
                    {badge.requirements.map((req, index) => (
                      <li key={index} className="flex items-center">
                        <div className="w-1 h-1 bg-antique-gold rounded-full mr-2" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Badge Stats */}
                <div className="pt-4 border-t border-olive-slate/20">
                  <div className="flex justify-between text-xs text-ivory-mist/60">
                    <span>{badge.holders.toLocaleString()} holders</span>
                    <span>{badge.percentage}% of users</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredBadges.length === 0 && (
            <Card className="bg-forest-night/60 backdrop-blur-sm border-olive-slate/30 p-12 text-center">
              <Trophy className="w-16 h-16 text-ivory-mist/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-ivory-mist mb-2">No badges found</h3>
              <p className="text-ivory-mist/70">Try adjusting your filters to see more badges</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
