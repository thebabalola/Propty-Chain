"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Building2,
  Users,
  TrendingUp,
  AlertTriangle,
  Settings,
  BarChart3,
  Shield,
  Eye,
  Ban,
  CheckCircle,
  XCircle,
  Search,
  Download,
  Upload,
  MessageSquare,
  Flag,
  Crown,
} from "lucide-react"

// Mock admin data
const platformStats = {
  totalUsers: 15293,
  activeUsers: 8947,
  totalProperties: 2847,
  activeListings: 1923,
  totalReviews: 8156,
  pendingReviews: 23,
  totalTransactions: 1456,
  totalVolume: "₦24.7B",
  monthlyRevenue: "₦125M",
  disputesOpen: 12,
  disputesResolved: 89,
}

// Mock disputes data
const disputes = [
  {
    id: 1,
    type: "Property Dispute",
    property: "Luxury Villa in Victoria Island",
    complainant: "0x1234...5678",
    respondent: "0x9876...4321",
    status: "Open",
    priority: "High",
    createdDate: "2024-01-20",
    description: "Property description does not match actual condition",
    evidence: ["photo1.jpg", "photo2.jpg"],
  },
  {
    id: 2,
    type: "Transaction Dispute",
    property: "Modern Apartment in Lekki",
    complainant: "0x5555...9999",
    respondent: "0x7777...3333",
    status: "Under Review",
    priority: "Medium",
    createdDate: "2024-01-18",
    description: "Escrow funds not released after completion",
    evidence: ["contract.pdf"],
  },
  {
    id: 3,
    type: "Review Dispute",
    property: "Commercial Office Space",
    complainant: "0x2222...8888",
    respondent: "0x4444...6666",
    status: "Resolved",
    priority: "Low",
    createdDate: "2024-01-15",
    description: "Fake review posted by competitor",
    evidence: [],
  },
]

// Mock users data
const users = [
  {
    id: 1,
    name: "John Adebayo",
    address: "0x1234...5678",
    email: "john@example.com",
    status: "Active",
    verified: true,
    role: "Property Owner",
    joinDate: "2023-01-15",
    properties: 12,
    reviews: 28,
    reputation: 4.8,
    lastActive: "2024-01-22",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    address: "0x9876...4321",
    email: "sarah@example.com",
    status: "Suspended",
    verified: false,
    role: "User",
    joinDate: "2023-06-10",
    properties: 0,
    reviews: 5,
    reputation: 3.2,
    lastActive: "2024-01-20",
  },
  {
    id: 3,
    name: "Michael Chen",
    address: "0x5555...9999",
    email: "michael@example.com",
    status: "Active",
    verified: true,
    role: "Premium User",
    joinDate: "2023-03-22",
    properties: 3,
    reviews: 15,
    reputation: 4.5,
    lastActive: "2024-01-22",
  },
]

// Mock content moderation data
const flaggedContent = [
  {
    id: 1,
    type: "Property",
    title: "Suspicious Land Plot",
    author: "0x1111...2222",
    reason: "Fraudulent listing",
    reports: 5,
    status: "Under Review",
    createdDate: "2024-01-21",
  },
  {
    id: 2,
    type: "Review",
    title: "Fake positive review",
    author: "0x3333...4444",
    reason: "Spam/Fake content",
    reports: 3,
    status: "Pending",
    createdDate: "2024-01-20",
  },
  {
    id: 3,
    type: "Property",
    title: "Overpriced Villa",
    author: "0x5555...6666",
    reason: "Misleading information",
    reports: 2,
    status: "Resolved",
    createdDate: "2024-01-19",
  },
]

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "resolved":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "suspended":
      case "under review":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "open":
      case "pending":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-olive-slate/20 text-olive-slate border-olive-slate/30"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "low":
        return "bg-green-500/20 text-green-400 border-green-500/30"
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
              <span className="text-xl font-bold text-ivory-mist">ProptyChain Admin</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="/" className="text-ivory-mist/80 hover:text-antique-gold transition-colors">
                Home
              </a>
              <a href="/marketplace" className="text-ivory-mist/80 hover:text-antique-gold transition-colors">
                Marketplace
              </a>
              <a href="/admin" className="text-antique-gold font-semibold">
                Admin Panel
              </a>
              <Button className="bg-antique-gold hover:bg-antique-gold/90 text-forest-night font-semibold">
                <Crown className="w-4 h-4 mr-2" />
                Admin
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-ivory-mist mb-4">Admin Dashboard</h1>
            <p className="text-lg text-ivory-mist/70">Manage and monitor the ProptyChain platform</p>
          </div>

          {/* Admin Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-forest-night/60 backdrop-blur-sm border-olive-slate/30 mb-6">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-antique-gold data-[state=active]:text-forest-night"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="disputes"
                className="data-[state=active]:bg-antique-gold data-[state=active]:text-forest-night"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Disputes ({disputes.filter((d) => d.status !== "Resolved").length})
              </TabsTrigger>
              <TabsTrigger
                value="users"
                className="data-[state=active]:bg-antique-gold data-[state=active]:text-forest-night"
              >
                <Users className="w-4 h-4 mr-2" />
                Users
              </TabsTrigger>
              <TabsTrigger
                value="content"
                className="data-[state=active]:bg-antique-gold data-[state=active]:text-forest-night"
              >
                <Flag className="w-4 h-4 mr-2" />
                Content Moderation
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="data-[state=active]:bg-antique-gold data-[state=active]:text-forest-night"
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="space-y-6">
                {/* Platform Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="bg-forest-night/60 backdrop-blur-sm border-olive-slate/30 p-4 text-center">
                    <Users className="w-8 h-8 text-antique-gold mx-auto mb-2" />
                    <div className="text-2xl font-bold text-ivory-mist">
                      {platformStats.totalUsers.toLocaleString()}
                    </div>
                    <div className="text-sm text-ivory-mist/70">Total Users</div>
                    <div className="text-xs text-green-400 mt-1">
                      {platformStats.activeUsers.toLocaleString()} active
                    </div>
                  </Card>
                  <Card className="bg-forest-night/60 backdrop-blur-sm border-olive-slate/30 p-4 text-center">
                    <Building2 className="w-8 h-8 text-antique-gold mx-auto mb-2" />
                    <div className="text-2xl font-bold text-ivory-mist">
                      {platformStats.totalProperties.toLocaleString()}
                    </div>
                    <div className="text-sm text-ivory-mist/70">Properties</div>
                    <div className="text-xs text-green-400 mt-1">
                      {platformStats.activeListings.toLocaleString()} active
                    </div>
                  </Card>
                  <Card className="bg-forest-night/60 backdrop-blur-sm border-olive-slate/30 p-4 text-center">
                    <MessageSquare className="w-8 h-8 text-antique-gold mx-auto mb-2" />
                    <div className="text-2xl font-bold text-ivory-mist">
                      {platformStats.totalReviews.toLocaleString()}
                    </div>
                    <div className="text-sm text-ivory-mist/70">Reviews</div>
                    <div className="text-xs text-yellow-400 mt-1">{platformStats.pendingReviews} pending</div>
                  </Card>
                  <Card className="bg-forest-night/60 backdrop-blur-sm border-olive-slate/30 p-4 text-center">
                    <TrendingUp className="w-8 h-8 text-antique-gold mx-auto mb-2" />
                    <div className="text-2xl font-bold text-ivory-mist">{platformStats.totalVolume}</div>
                    <div className="text-sm text-ivory-mist/70">Total Volume</div>
                    <div className="text-xs text-green-400 mt-1">{platformStats.monthlyRevenue} this month</div>
                  </Card>
                </div>

                {/* Recent Activity */}
                <div className="grid lg:grid-cols-2 gap-6">
                  <Card className="bg-forest-night/60 backdrop-blur-sm border-olive-slate/30 p-6">
                    <h3 className="text-lg font-semibold text-ivory-mist mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full" />
                        <span className="text-ivory-mist/80">New property listed: "Luxury Villa in VI"</span>
                        <span className="text-xs text-ivory-mist/60">5m ago</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-400 rounded-full" />
                        <span className="text-ivory-mist/80">User verification completed</span>
                        <span className="text-xs text-ivory-mist/60">12m ago</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-red-400 rounded-full" />
                        <span className="text-ivory-mist/80">Dispute opened for property #1234</span>
                        <span className="text-xs text-ivory-mist/60">1h ago</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-antique-gold rounded-full" />
                        <span className="text-ivory-mist/80">Transaction completed: ₦85M</span>
                        <span className="text-xs text-ivory-mist/60">2h ago</span>
                      </div>
                    </div>
                  </Card>

                  <Card className="bg-forest-night/60 backdrop-blur-sm border-olive-slate/30 p-6">
                    <h3 className="text-lg font-semibold text-ivory-mist mb-4">System Health</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-ivory-mist/80">Platform Uptime</span>
                        <span className="text-green-400 font-semibold">99.9%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-ivory-mist/80">Active Disputes</span>
                        <span className="text-yellow-400 font-semibold">{platformStats.disputesOpen}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-ivory-mist/80">Pending Reviews</span>
                        <span className="text-blue-400 font-semibold">{platformStats.pendingReviews}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-ivory-mist/80">System Load</span>
                        <span className="text-green-400 font-semibold">Normal</span>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Quick Actions */}
                <Card className="bg-forest-night/60 backdrop-blur-sm border-olive-slate/30 p-6">
                  <h3 className="text-lg font-semibold text-ivory-mist mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button className="bg-antique-gold hover:bg-antique-gold/90 text-forest-night font-semibold">
                      <Download className="w-4 h-4 mr-2" />
                      Export Data
                    </Button>
                    <Button
                      variant="outline"
                      className="border-olive-slate text-ivory-mist hover:bg-olive-slate/20 bg-transparent"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Import Users
                    </Button>
                    <Button
                      variant="outline"
                      className="border-olive-slate text-ivory-mist hover:bg-olive-slate/20 bg-transparent"
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Security Audit
                    </Button>
                    <Button
                      variant="outline"
                      className="border-olive-slate text-ivory-mist hover:bg-olive-slate/20 bg-transparent"
                    >
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Generate Report
                    </Button>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="disputes">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-ivory-mist">Dispute Management</h3>
                  <div className="flex space-x-2">
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger className="w-40 bg-forest-night/40 border-olive-slate/30 text-ivory-mist">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent className="bg-forest-night border-olive-slate/30">
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="under-review">Under Review</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {disputes.map((dispute) => (
                  <Card key={dispute.id} className="bg-forest-night/60 backdrop-blur-sm border-olive-slate/30 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-semibold text-ivory-mist">{dispute.property}</h4>
                          <Badge className={getStatusColor(dispute.status)}>{dispute.status}</Badge>
                          <Badge className={getPriorityColor(dispute.priority)}>{dispute.priority}</Badge>
                        </div>
                        <p className="text-ivory-mist/70 mb-2">{dispute.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-ivory-mist/60">
                          <span>Type: {dispute.type}</span>
                          <span>Created: {dispute.createdDate}</span>
                          <span>Evidence: {dispute.evidence.length} files</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <span className="text-sm text-ivory-mist/70">Complainant:</span>
                        <div className="text-ivory-mist font-mono">{dispute.complainant}</div>
                      </div>
                      <div>
                        <span className="text-sm text-ivory-mist/70">Respondent:</span>
                        <div className="text-ivory-mist font-mono">{dispute.respondent}</div>
                      </div>
                    </div>

                    {dispute.status !== "Resolved" && (
                      <div className="flex space-x-3">
                        <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Resolve in Favor
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-500 text-red-400 hover:bg-red-500/20 bg-transparent"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject Dispute
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-olive-slate text-ivory-mist hover:bg-olive-slate/20 bg-transparent"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="users">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-ivory-mist">User Management</h3>
                  <div className="flex space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ivory-mist/50 w-4 h-4" />
                      <Input
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64 bg-forest-night/40 border-olive-slate/30 text-ivory-mist placeholder:text-ivory-mist/50"
                      />
                    </div>
                  </div>
                </div>

                {users.map((user) => (
                  <Card key={user.id} className="bg-forest-night/60 backdrop-blur-sm border-olive-slate/30 p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback className="bg-antique-gold text-forest-night">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-lg font-semibold text-ivory-mist">{user.name}</h4>
                            <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                            {user.verified && (
                              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Verified</Badge>
                            )}
                          </div>
                          <p className="text-ivory-mist/70 font-mono text-sm">{user.address}</p>
                          <div className="flex items-center space-x-4 text-sm text-ivory-mist/60 mt-1">
                            <span>{user.role}</span>
                            <span>Joined: {user.joinDate}</span>
                            <span>Properties: {user.properties}</span>
                            <span>Reviews: {user.reviews}</span>
                            <span>Rating: {user.reputation}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="ghost" className="text-ivory-mist hover:bg-forest-night/40">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-ivory-mist hover:bg-forest-night/40">
                          <Shield className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-red-400 hover:bg-red-500/20">
                          <Ban className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="content">
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-ivory-mist">Content Moderation</h3>

                {flaggedContent.map((content) => (
                  <Card key={content.id} className="bg-forest-night/60 backdrop-blur-sm border-olive-slate/30 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-semibold text-ivory-mist">{content.title}</h4>
                          <Badge className={getStatusColor(content.status)}>{content.status}</Badge>
                          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                            {content.reports} reports
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-ivory-mist/60 mb-2">
                          <span>Type: {content.type}</span>
                          <span>Author: {content.author}</span>
                          <span>Created: {content.createdDate}</span>
                        </div>
                        <p className="text-ivory-mist/70">Reason: {content.reason}</p>
                      </div>
                    </div>

                    {content.status !== "Resolved" && (
                      <div className="flex space-x-3">
                        <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white">
                          <Ban className="w-4 h-4 mr-2" />
                          Remove Content
                        </Button>
                        <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve Content
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-olive-slate text-ivory-mist hover:bg-olive-slate/20 bg-transparent"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Review Details
                        </Button>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="settings">
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-ivory-mist">Platform Settings</h3>

                <div className="grid lg:grid-cols-2 gap-6">
                  <Card className="bg-forest-night/60 backdrop-blur-sm border-olive-slate/30 p-6">
                    <h4 className="text-lg font-semibold text-ivory-mist mb-4">Transaction Fees</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-ivory-mist/70">Platform Fee (%)</label>
                        <Input
                          type="number"
                          defaultValue="2.5"
                          className="bg-forest-night/40 border-olive-slate/30 text-ivory-mist"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-ivory-mist/70">Escrow Fee (₦)</label>
                        <Input
                          type="number"
                          defaultValue="50000"
                          className="bg-forest-night/40 border-olive-slate/30 text-ivory-mist"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-ivory-mist/70">Listing Fee (₦)</label>
                        <Input
                          type="number"
                          defaultValue="25000"
                          className="bg-forest-night/40 border-olive-slate/30 text-ivory-mist"
                        />
                      </div>
                    </div>
                  </Card>

                  <Card className="bg-forest-night/60 backdrop-blur-sm border-olive-slate/30 p-6">
                    <h4 className="text-lg font-semibold text-ivory-mist mb-4">Platform Limits</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-ivory-mist/70">Max Properties per User</label>
                        <Input
                          type="number"
                          defaultValue="50"
                          className="bg-forest-night/40 border-olive-slate/30 text-ivory-mist"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-ivory-mist/70">Max Reviews per Property</label>
                        <Input
                          type="number"
                          defaultValue="100"
                          className="bg-forest-night/40 border-olive-slate/30 text-ivory-mist"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-ivory-mist/70">Min Transaction Amount (₦)</label>
                        <Input
                          type="number"
                          defaultValue="1000000"
                          className="bg-forest-night/40 border-olive-slate/30 text-ivory-mist"
                        />
                      </div>
                    </div>
                  </Card>

                  <Card className="bg-forest-night/60 backdrop-blur-sm border-olive-slate/30 p-6">
                    <h4 className="text-lg font-semibold text-ivory-mist mb-4">Security Settings</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-ivory-mist/70">KYC Required</label>
                        <Select defaultValue="yes">
                          <SelectTrigger className="bg-forest-night/40 border-olive-slate/30 text-ivory-mist">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-forest-night border-olive-slate/30">
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm text-ivory-mist/70">Two-Factor Authentication</label>
                        <Select defaultValue="required">
                          <SelectTrigger className="bg-forest-night/40 border-olive-slate/30 text-ivory-mist">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-forest-night border-olive-slate/30">
                            <SelectItem value="required">Required</SelectItem>
                            <SelectItem value="optional">Optional</SelectItem>
                            <SelectItem value="disabled">Disabled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </Card>

                  <Card className="bg-forest-night/60 backdrop-blur-sm border-olive-slate/30 p-6">
                    <h4 className="text-lg font-semibold text-ivory-mist mb-4">Notification Settings</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-ivory-mist/70">Email Notifications</label>
                        <Select defaultValue="enabled">
                          <SelectTrigger className="bg-forest-night/40 border-olive-slate/30 text-ivory-mist">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-forest-night border-olive-slate/30">
                            <SelectItem value="enabled">Enabled</SelectItem>
                            <SelectItem value="disabled">Disabled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm text-ivory-mist/70">SMS Notifications</label>
                        <Select defaultValue="critical">
                          <SelectTrigger className="bg-forest-night/40 border-olive-slate/30 text-ivory-mist">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-forest-night border-olive-slate/30">
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="critical">Critical Only</SelectItem>
                            <SelectItem value="disabled">Disabled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </Card>
                </div>

                <div className="flex justify-end space-x-4">
                  <Button
                    variant="outline"
                    className="border-olive-slate text-ivory-mist hover:bg-olive-slate/20 bg-transparent"
                  >
                    Reset to Defaults
                  </Button>
                  <Button className="bg-antique-gold hover:bg-antique-gold/90 text-forest-night font-semibold">
                    Save Changes
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
