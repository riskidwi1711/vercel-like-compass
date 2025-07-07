
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Tags,
  Users,
  BarChart3,
  Settings,
  Plus,
  ChevronDown,
  ChevronRight,
  CheckCircle
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Content", url: "/content", icon: FileText },
  { title: "Categories", url: "/categories", icon: Tags },
  { title: "Users", url: "/users", icon: Users },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Settings", url: "/settings", icon: Settings },
];

const recentContent = [
  { name: "Getting Started Guide", status: "Published", type: "blog" },
  { name: "API Documentation", status: "Draft", type: "docs" },
  { name: "User Tutorial", status: "Published", type: "blog" },
];

export function DashboardSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const [contentExpanded, setContentExpanded] = useState(true);
  const collapsed = state === "collapsed";
  
  const isActive = (path: string) => location.pathname === path;
  
  const getNavClassName = (active: boolean) =>
    `flex items-center w-full transition-colors ${
      active 
        ? "bg-primary/10 text-primary font-medium border-r-2 border-primary" 
        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
    }`;

  return (
    <Sidebar className={collapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarContent className="bg-card border-r">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <h2 className="font-semibold text-sm truncate">CMS Dashboard</h2>
                <p className="text-xs text-muted-foreground truncate">Content Management</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end
                      className={({ isActive }) => getNavClassName(isActive)}
                      title={collapsed ? item.title : undefined}
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {!collapsed && <span className="ml-3 truncate">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {!collapsed && (
          <SidebarGroup>
            <SidebarGroupLabel className="flex items-center justify-between px-3 py-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Recent Content
              </span>
              <button
                onClick={() => setContentExpanded(!contentExpanded)}
                className="p-1 rounded hover:bg-muted/50"
              >
                {contentExpanded ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
              </button>
            </SidebarGroupLabel>
            
            {contentExpanded && (
              <SidebarGroupContent>
                <SidebarMenu>
                  {recentContent.map((content) => (
                    <SidebarMenuItem key={content.name}>
                      <SidebarMenuButton asChild>
                        <div className="flex items-center justify-between w-full px-3 py-2 text-sm rounded-md hover:bg-muted/50 cursor-pointer">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                              content.status === 'Published' ? 'bg-green-500' : 'bg-yellow-500'
                            }`}></div>
                            <span className="truncate">{content.name}</span>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${
                            content.status === 'Published' 
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {content.status}
                          </span>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <div className="flex items-center gap-2 w-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground rounded-md hover:bg-muted/50 cursor-pointer">
                        <Plus className="h-4 w-4 flex-shrink-0" />
                        <span>New Content</span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            )}
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
