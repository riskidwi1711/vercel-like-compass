import { useState } from "react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWebsite } from "@/hooks/useWebsite";
import { useToast } from "@/hooks/use-toast";
import { 
  ShoppingCart, 
  CreditCard, 
  Truck, 
  Mail, 
  MessageSquare, 
  Settings,
  Download,
  Trash2,
  ExternalLink
} from "lucide-react";

// Mock data for available plugins
const availablePlugins = [
  {
    id: "payment-gateway",
    name: "Payment Gateway",
    description: "Accept payments through multiple providers including Stripe, PayPal, and local payment methods",
    category: "payment",
    version: "1.2.0",
    price: 29.99,
    icon: CreditCard,
    features: ["Multiple payment methods", "Secure transactions", "Invoice generation"],
    developer: "PaymentCorp"
  },
  {
    id: "raja-ongkir",
    name: "Raja Ongkir",
    description: "Indonesian shipping cost calculator integration with major courier services",
    category: "shipping",
    version: "2.1.0",
    price: 19.99,
    icon: Truck,
    features: ["Real-time shipping rates", "Multiple couriers", "Tracking integration"],
    developer: "LogisticsPro"
  },
  {
    id: "email-marketing",
    name: "Email Marketing",
    description: "Automated email campaigns and newsletter management",
    category: "marketing",
    version: "1.5.2",
    price: 39.99,
    icon: Mail,
    features: ["Email automation", "Campaign analytics", "Template library"],
    developer: "MarketingHub"
  },
  {
    id: "live-chat",
    name: "Live Chat Support",
    description: "Real-time customer support chat widget",
    category: "support",
    version: "1.0.8",
    price: 24.99,
    icon: MessageSquare,
    features: ["Real-time messaging", "File sharing", "Chat history"],
    developer: "SupportDesk"
  }
];

// Mock data for installed plugins
const installedPlugins = [
  {
    id: "payment-gateway",
    name: "Payment Gateway",
    version: "1.2.0",
    status: "active",
    installedAt: "2024-01-15"
  }
];

export default function Plugins() {
  const { selectedWebsite } = useWebsite();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("marketplace");

  const handleInstallPlugin = (pluginId: string, pluginName: string) => {
    toast({
      title: "Plugin Installing",
      description: `${pluginName} is being installed to your website.`,
    });
  };

  const handleUninstallPlugin = (pluginId: string, pluginName: string) => {
    toast({
      title: "Plugin Uninstalled",
      description: `${pluginName} has been removed from your website.`,
      variant: "destructive"
    });
  };

  const handleConfigurePlugin = (pluginId: string, pluginName: string) => {
    toast({
      title: "Plugin Configuration",
      description: `Opening configuration for ${pluginName}.`,
    });
  };

  if (!selectedWebsite) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <DashboardHeader />
        <main className="p-6 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Select a Website</h3>
            <p className="text-muted-foreground">Please select a website to manage plugins.</p>
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
          <h1 className="text-3xl font-bold tracking-tight">Plugin Marketplace</h1>
          <p className="text-muted-foreground text-lg">
            Extend your website functionality with powerful plugins
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
            <TabsTrigger value="installed">Installed Plugins</TabsTrigger>
          </TabsList>

          <TabsContent value="marketplace" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availablePlugins.map((plugin) => {
                const IconComponent = plugin.icon;
                const isInstalled = installedPlugins.some(p => p.id === plugin.id);
                
                return (
                  <Card key={plugin.id} className="relative group hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <IconComponent className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{plugin.name}</CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">{plugin.category}</Badge>
                            <span className="text-sm text-muted-foreground">v{plugin.version}</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <CardDescription>{plugin.description}</CardDescription>
                      
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Features:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {plugin.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <div className="w-1 h-1 bg-primary rounded-full" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div>
                          <div className="text-lg font-semibold">${plugin.price}</div>
                          <div className="text-xs text-muted-foreground">by {plugin.developer}</div>
                        </div>
                        
                        {isInstalled ? (
                          <Badge variant="secondary">Installed</Badge>
                        ) : (
                          <Button 
                            onClick={() => handleInstallPlugin(plugin.id, plugin.name)}
                            size="sm"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Install
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="installed" className="space-y-6">
            {installedPlugins.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Plugins Installed</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Install plugins from the marketplace to extend your website functionality.
                  </p>
                  <Button onClick={() => setActiveTab("marketplace")}>
                    Browse Marketplace
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {installedPlugins.map((plugin) => {
                  const pluginDetails = availablePlugins.find(p => p.id === plugin.id);
                  const IconComponent = pluginDetails?.icon || Settings;
                  
                  return (
                    <Card key={plugin.id}>
                      <CardContent className="flex items-center justify-between p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <IconComponent className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{plugin.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>Version {plugin.version}</span>
                              <span>•</span>
                              <Badge 
                                variant={plugin.status === 'active' ? 'default' : 'secondary'}
                                className="text-xs"
                              >
                                {plugin.status}
                              </Badge>
                              <span>•</span>
                              <span>Installed {plugin.installedAt}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleConfigurePlugin(plugin.id, plugin.name)}
                          >
                            <Settings className="h-4 w-4 mr-2" />
                            Configure
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUninstallPlugin(plugin.id, plugin.name)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Uninstall
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}