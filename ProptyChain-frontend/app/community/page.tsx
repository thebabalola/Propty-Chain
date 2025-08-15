"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  MessageCircle,
  Calendar,
  Award,
  TrendingUp,
  Heart,
  Share2,
  Star,
  MapPin,
  Building2,
} from "lucide-react"

export default function CommunityPage() {
  const communityStats = [
    { value: "2,847", label: "Active Members", icon: Users },
    { value: "156", label: "Discussions", icon: MessageCircle },
    { value: "23", label: "Events This Month", icon: Calendar },
    { value: "89", label: "Success Stories", icon: Award },
  ]

  const recentDiscussions = [
    {
      title: "Best practices for property verification",
      author: "Sarah Johnson",
      replies: 12,
      likes: 34,
      time: "2 hours ago",
      category: "Verification",
    },
    {
      title: "New features coming to ProptyChain",
      author: "Mike Chen",
      replies: 8,
      likes: 28,
      time: "5 hours ago",
      category: "Updates",
    },
    {
      title: "Community meetup in Lagos next week",
      author: "Aisha Bello",
      replies: 15,
      likes: 42,
      time: "1 day ago",
      category: "Events",
    },
  ]

  const upcomingEvents = [
    {
      title: "ProptyChain Lagos Meetup",
      date: "Dec 15, 2024",
      time: "6:00 PM",
      location: "Lagos, Nigeria",
      attendees: 45,
      type: "In-Person",
    },
    {
      title: "Web3 Real Estate Workshop",
      date: "Dec 20, 2024",
      time: "2:00 PM",
      location: "Online",
      attendees: 120,
      type: "Virtual",
    },
  ]

  return (
    <div className="min-h-screen bg-ivory-mist dark:bg-slate-900 theme-transition pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-forest-night via-olive-slate to-forest-night relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/abstract-geometric-pattern.png')] opacity-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <Badge className="bg-antique-gold/20 text-antique-gold border-antique-gold/40 mb-4">
              🚀 Join Our Community
            </Badge>
            <h1 className="text-5xl lg:text-6xl font-bold text-ivory-mist mb-6">
              Connect with <span className="text-antique-gold">Real Estate</span> Innovators
            </h1>
            <p className="text-xl text-ivory-mist/80 max-w-3xl mx-auto mb-10 leading-relaxed">
              Join thousands of professionals, investors, and enthusiasts who are shaping the future of real estate through blockchain technology.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="btn-primary text-ivory-mist px-8 py-4 text-lg font-semibold">
                <Users className="w-5 h-5 mr-2" />
                Join Community
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-ivory-mist text-ivory-mist hover:bg-ivory-mist hover:text-forest-night px-8 py-4 text-lg font-semibold"
              >
                <Calendar className="w-5 h-5 mr-2" />
                View Events
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Community Stats */}
      <section className="py-16 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {communityStats.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <div
                  key={index}
                  className="text-center glass-card p-6 rounded-xl theme-transition"
                >
                  <IconComponent className="w-8 h-8 text-antique-gold mx-auto mb-3" />
                  <div className="text-3xl font-bold text-forest-night dark:text-ivory-mist mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-forest-night/70 dark:text-ivory-mist/70">
                    {stat.label}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Recent Discussions & Events */}
      <section className="py-16 bg-ivory-mist dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Recent Discussions */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-forest-night dark:text-ivory-mist">
                  Recent Discussions
                </h2>
                <Button variant="outline" className="border-forest-night text-forest-night dark:border-ivory-mist dark:text-ivory-mist">
                  View All
                </Button>
              </div>
              
              <div className="space-y-4">
                {recentDiscussions.map((discussion, index) => (
                  <div
                    key={index}
                    className="glass-card p-6 rounded-xl theme-transition hover:scale-105 cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-forest-night dark:text-ivory-mist">
                        {discussion.title}
                      </h3>
                      <Badge className="bg-antique-gold/20 text-antique-gold border-antique-gold/40 text-xs">
                        {discussion.category}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-forest-night/70 dark:text-ivory-mist/70">
                      <span>by {discussion.author}</span>
                      <span>{discussion.time}</span>
                    </div>
                    <div className="flex items-center space-x-4 mt-3">
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm">{discussion.replies}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className="w-4 h-4" />
                        <span className="text-sm">{discussion.likes}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Events */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-forest-night dark:text-ivory-mist">
                  Upcoming Events
                </h2>
                <Button variant="outline" className="border-forest-night text-forest-night dark:border-ivory-mist dark:text-ivory-mist">
                  View All
                </Button>
              </div>
              
              <div className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <div
                    key={index}
                    className="glass-card p-6 rounded-xl theme-transition hover:scale-105 cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-forest-night dark:text-ivory-mist">
                        {event.title}
                      </h3>
                      <Badge className={`text-xs ${
                        event.type === "In-Person" 
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" 
                          : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      }`}>
                        {event.type}
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm text-forest-night/70 dark:text-ivory-mist/70">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{event.date} at {event.time}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4" />
                        <span>{event.attendees} attending</span>
                      </div>
                    </div>
                    <Button className="w-full mt-4 btn-primary">
                      Join Event
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-forest-night via-olive-slate to-forest-night relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/abstract-geometric-pattern.png')] opacity-10"></div>
        
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-4xl lg:text-5xl font-bold text-ivory-mist mb-6">
            Ready to Join the Revolution?
          </h2>
          <p className="text-xl text-ivory-mist/80 mb-10 leading-relaxed">
            Connect with like-minded professionals, share insights, and stay updated with the latest in blockchain real estate.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              size="lg"
              className="bg-antique-gold text-forest-night hover:bg-antique-gold/90 px-8 py-4 text-lg font-semibold"
            >
              <Users className="w-5 h-5 mr-2" />
              Join Community
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-ivory-mist text-ivory-mist hover:bg-ivory-mist/10 px-8 py-4 text-lg font-semibold"
            >
              <Share2 className="w-5 h-5 mr-2" />
              Share with Friends
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
