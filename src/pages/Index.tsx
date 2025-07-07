import { DashboardHeader } from "@/components/DashboardHeader";
import { StatsCard } from "@/components/StatsCard";
import { Button } from "@/components/ui/button";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { 
  Globe, 
  Zap, 
  Users, 
  Activity, 
  Plus,
  TrendingUp,
  Clock,
  CheckCircle,
  FileText,
  Tags
} from "lucide-react";
import { useWebsite } from "@/hooks/useWebsite";

const recentActivity = [
  {
    id: 1,
    action: "New blog post published",
    description: "Getting Started with React Hooks",
    time: "2 hours ago",
    type: "success",
    icon: CheckCircle
  },
  {
    id: 2,
    action: "Content being reviewed",
    description: "Advanced JavaScript Concepts",
    time: "5 minutes ago",
    type: "pending",
    icon: Clock
  },
  {
    id: 3,
    action: "New user registered",
    description: "sarah@example.com joined the platform",
    time: "1 hour ago",
    type: "info",
    icon: Users
  }
];

export default function Index() {
  const { data: stats, isLoading, error } = useDashboardStats();
  const { selectedWebsite } = useWebsite();

  // Default stats while loading or on error
  const defaultStats = [
    {
      title: "Total Users",
      value: isLoading ? "..." : error ? "Error" : stats?.userCount.toString() || "0",
      change: "+2 from last month",
      changeType: "positive" as const,
      icon: Users
    },
    {
      title: "Total Content",
      value: isLoading ? "..." : error ? "Error" : stats?.contentCount.toString() || "0",
      change: "+12 from last week",
      changeType: "positive" as const,
      icon: FileText
    },
    {
      title: "Categories",
      value: isLoading ? "..." : error ? "Error" : stats?.categoryCount.toString() || "0",
      change: "+1 from last month",
      changeType: "positive" as const,
      icon: Tags
    },
    {
      title: "Uptime",
      value: "99.9%",
      change: "Same as last month",
      changeType: "neutral" as const,
      icon: Activity
    }
  ];

  if (!selectedWebsite) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <DashboardHeader />
        <main className="p-6 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Welcome to Multi-Tenant CMS</h3>
            <p className="text-muted-foreground">Please select or create a website to get started.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <DashboardHeader />
      
      <main className="p-6 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome to {selectedWebsite.name}! 👋
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage content, users, and analytics for {selectedWebsite.domain}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {defaultStats.map((stat) => (
            <StatsCard key={stat.title} {...stat} />
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Recent Activity</h2>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
          
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div 
                key={activity.id}
                className={`flex items-center gap-4 p-3 rounded-lg border ${
                  activity.type === 'success' ? 'bg-green-50 border-green-200' :
                  activity.type === 'pending' ? 'bg-yellow-50 border-yellow-200' :
                  'bg-blue-50 border-blue-200'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  activity.type === 'success' ? 'bg-green-100' :
                  activity.type === 'pending' ? 'bg-yellow-100' :
                  'bg-blue-100'
                }`}>
                  <activity.icon className={`h-4 w-4 ${
                    activity.type === 'success' ? 'text-green-600' :
                    activity.type === 'pending' ? 'text-yellow-600' :
                    'text-blue-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
                <TrendingUp className={`h-4 w-4 ${
                  activity.type === 'success' ? 'text-green-600' :
                  activity.type === 'pending' ? 'text-yellow-600' :
                  'text-blue-600'
                }`} />
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg border p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">Create Content</h3>
                <p className="text-sm text-muted-foreground">Write a new blog post or article</p>
              </div>
            </div>
            <Button className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              New Content
            </Button>
          </div>

          <div className="bg-white rounded-lg border p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Tags className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold">Manage Categories</h3>
                <p className="text-sm text-muted-foreground">Organize your content</p>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </div>

          <div className="bg-white rounded-lg border p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">User Management</h3>
                <p className="text-sm text-muted-foreground">View and manage users</p>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              View Users
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
