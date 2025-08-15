import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  MapPin,
  Star,
  Heart,
  Home,
  Building,
  Warehouse,
  TreePine,
  Building2,
  Phone,
  Calendar,
  CheckCircle,
  Eye,
} from "lucide-react"

interface PropertyCardProps {
  property: {
    id: number
    title: string
    location: string
    price: string
    type: string
    rating: number
    reviews: number
    image: string
    owner: string
    ownerImage?: string
    ownerTitle?: string
    badges: string[]
    bedrooms: number
    bathrooms: number
    area: string
    agentPhone?: string
    lastUpdated?: string
  }
}

export function PropertyCard({ property }: PropertyCardProps) {
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
        return "trust-badge"
      case "premium":
        return "premium-badge"
      case "exclusive":
        return "bg-purple-500/20 text-purple-600 border-purple-500/30"
      case "commercial":
        return "verified-badge"
      default:
        return "bg-olive-slate/20 text-olive-slate border-olive-slate/30"
    }
  }

  return (
    <Card className="bg-white border-olive-slate/20 overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer hover-lift">
      {/* Property Image */}
      <div className="relative overflow-hidden">
        <Image
          src={property.image || "/placeholder.svg"}
          alt={property.title}
          width={400}
          height={192}
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
          className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm hover:bg-white/90"
        >
          <Heart className="w-4 h-4 text-forest-night" />
        </Button>

        {/* Quick Actions Overlay */}
        <div className="absolute bottom-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button size="sm" className="bg-antique-gold hover:bg-antique-gold/90 text-forest-night">
            <Phone className="w-4 h-4" />
          </Button>
          <Button size="sm" className="bg-forest-night hover:bg-forest-night/90 text-ivory-mist">
            <Calendar className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Property Details */}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-2">
          {getPropertyIcon(property.type)}
          <span className="text-sm text-olive-slate font-medium">{property.type}</span>
          {property.lastUpdated && (
            <span className="text-xs text-forest-night/50 ml-auto">Updated {property.lastUpdated}</span>
          )}
        </div>

        <h3 className="text-lg font-semibold text-forest-night mb-2 group-hover:text-antique-gold transition-colors">
          {property.title}
        </h3>

        <div className="flex items-center text-forest-night/70 mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm">{property.location}</span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Star className="w-4 h-4 text-antique-gold mr-1 fill-current" />
            <span className="text-sm text-forest-night font-medium">{property.rating}</span>
            <span className="text-sm text-forest-night/60 ml-1">({property.reviews} reviews)</span>
          </div>
          <div className="text-xl font-bold text-antique-gold">{property.price}</div>
        </div>

        {/* Property Stats */}
        <div className="flex justify-between text-sm text-forest-night/70 mb-4 bg-ivory-mist/50 p-3 rounded-lg">
          {property.bedrooms > 0 && <span className="font-medium">{property.bedrooms} bed</span>}
          {property.bathrooms > 0 && <span className="font-medium">{property.bathrooms} bath</span>}
          <span className="font-medium">{property.area}</span>
        </div>

        {/* Professional Agent/Owner Section */}
        <div className="flex items-center justify-between pt-4 border-t border-olive-slate/20">
          <div className="flex items-center space-x-3">
            {property.ownerImage ? (
              <Image
                src={property.ownerImage || "/placeholder.svg"}
                alt={property.owner}
                width={32}
                height={32}
                className="w-8 h-8 rounded-full object-cover border border-antique-gold/30"
              />
            ) : (
              <div className="w-8 h-8 bg-antique-gold/20 rounded-full flex items-center justify-center">
                <Building2 className="w-4 h-4 text-antique-gold" />
              </div>
            )}
            <div>
              <div className="text-sm font-medium text-forest-night">{property.owner}</div>
              {property.ownerTitle && <div className="text-xs text-olive-slate">{property.ownerTitle}</div>}
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-xs text-green-600 font-medium">Verified</span>
          </div>
        </div>

        {/* Professional CTA Buttons */}
        <div className="flex space-x-2 mt-4">
          <Button size="sm" className="flex-1 btn-primary text-ivory-mist">
            <Eye className="w-4 h-4 mr-1" />
            View Details
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-antique-gold text-antique-gold hover:bg-antique-gold hover:text-forest-night bg-transparent"
          >
            <Phone className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
