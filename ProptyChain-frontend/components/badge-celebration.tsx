"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, X, Share2, Twitter } from "lucide-react"

interface BadgeCelebrationProps {
  badge: {
    id: number
    name: string
    description: string
    icon: string
    rarity: string
    points: number
  }
  isOpen: boolean
  onClose: () => void
}

export function BadgeCelebration({ badge, isOpen, onClose }: BadgeCelebrationProps) {
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true)
      const timer = setTimeout(() => setShowConfetti(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-forest-night/80 backdrop-blur-sm">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-antique-gold rounded-full animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      <Card className="bg-forest-night/90 backdrop-blur-sm border-olive-slate/30 p-8 max-w-md mx-4 text-center relative">
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-4 right-4 text-ivory-mist/70 hover:text-ivory-mist"
          onClick={onClose}
        >
          <X className="w-4 h-4" />
        </Button>

        <div className="mb-6">
          <div className="text-6xl mb-4 animate-bounce">{badge.icon}</div>
          <div className="flex items-center justify-center mb-2">
            <CheckCircle className="w-6 h-6 text-green-400 mr-2" />
            <span className="text-green-400 font-semibold">Badge Unlocked!</span>
          </div>
          <Badge className={getRarityColor(badge.rarity)}>{badge.rarity}</Badge>
        </div>

        <h2 className="text-2xl font-bold text-ivory-mist mb-2">{badge.name}</h2>
        <p className="text-ivory-mist/70 mb-4">{badge.description}</p>

        <div className="bg-antique-gold/20 rounded-lg p-4 mb-6">
          <div className="text-2xl font-bold text-antique-gold">+{badge.points}</div>
          <div className="text-sm text-ivory-mist/70">Achievement Points</div>
        </div>

        <div className="flex space-x-3">
          <Button className="flex-1 bg-antique-gold hover:bg-antique-gold/90 text-forest-night font-semibold">
            <Share2 className="w-4 h-4 mr-2" />
            Share Achievement
          </Button>
          <Button
            variant="outline"
            className="border-olive-slate text-ivory-mist hover:bg-olive-slate/20 bg-transparent"
          >
            <Twitter className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  )
}
