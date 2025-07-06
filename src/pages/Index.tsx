
import { DashboardHeader } from "@/components/DashboardHeader";
import { ProjectCard } from "@/components/ProjectCard";
import { StatsCard } from "@/components/StatsCard";
import { Button } from "@/components/ui/button";
import { 
  Globe, 
  Zap, 
  Users, 
  Activity, 
  Plus,
  TrendingUp,
  Clock,
  CheckCircle
} from "lucide-react";

const projects = [
  {
    name: "my-portfolio",
    description: "Personal portfolio website built with Next.js and Tailwind CSS. Showcasing my projects and skills.",
    status: "Ready" as const,
    url: "my-portfolio.vercel.app",
    lastDeployed: "2 hours ago",
    framework: "Next.js",
    branch: "main"
  },
  {
    name: "ecommerce-app",
    description: "Full-stack e-commerce application with payment integration and admin dashboard.",
    status: "Building" as const,
    url: "ecommerce-app.vercel.app",
    lastDeployed: "1 day ago",
    framework: "React",
    branch: "develop"
  },
  {
    name: "blog-platform",
    description: "Modern blog platform with CMS integration and SEO optimization.",
    status: "Ready" as const,
    url: "blog-platform.vercel.app",
    lastDeployed: "3 days ago",
    framework: "Next.js",
    branch: "main"
  },
  {
    name: "task-manager",
    description: "Collaborative task management tool with real-time updates and team features.",
    status: "Error" as const,
    url: "task-manager.vercel.app",
    lastDeployed: "5 days ago",
    framework: "Vue.js",
    branch: "main"
  },
  {
    name: "weather-app",
    description: "Beautiful weather application with location-based forecasts and interactive maps.",
    status: "Ready" as const,
    url: "weather-app.vercel.app",
    lastDeployed: "1 week ago",
    framework: "React",
    branch: "main"
  },
  {
    name: "chat-application",
    description: "Real-time chat application with video calls and file sharing capabilities.",
    status: "Queued" as const,
    url: "chat-app.vercel.app",
    lastDeployed: "2 weeks ago",
    framework: "Next.js",
    branch: "feature/video-calls"
  }
];

const stats = [
  {
    title: "Total Projects",
    value: "24",
    change: "+2 from last month",
    changeType: "positive" as const,
    icon: Globe
  },
  {
    title: "Deployments",
    value: "156",
    change: "+12 from last week",
    changeType: "positive" as const,
    icon: Zap
  },
  {
    title: "Team Members",
    value: "8",
    change: "+1 from last month",
    changeType: "positive" as const,
    icon: Users
  },
  {
    title: "Uptime",
    value: "99.9%",
    change: "Same as last month",
    changeType: "neutral" as const,
    icon: Activity
  }
];

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <DashboardHeader />
      
      <main className="p-6 space-y-8">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, John! 👋
          </h1>
          <p className="text-muted-foreground text-lg">
            Here's what's happening with your projects today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
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
            <div className="flex items-center gap-4 p-3 rounded-lg bg-green-50 border border-green-200">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">my-portfolio deployed successfully</p>
                <p className="text-sm text-muted-foreground">2 hours ago • main branch</p>
              </div>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
            
            <div className="flex items-center gap-4 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="h-4 w-4 text-yellow-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">ecommerce-app is building</p>
                <p className="text-sm text-muted-foreground">Started 5 minutes ago • develop branch</p>
              </div>
              <Activity className="h-4 w-4 text-yellow-600 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Your Projects</h2>
              <p className="text-muted-foreground">
                Manage and deploy your applications
              </p>
            </div>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-md">
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.name} {...project} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
