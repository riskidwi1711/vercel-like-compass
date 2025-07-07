
import { useState } from "react";
import { Globe, Plus, Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWebsite } from "@/hooks/useWebsite";

export function WebsiteSelector() {
  const { 
    websites, 
    selectedWebsite, 
    setSelectedWebsiteId, 
    createWebsite,
    loading 
  } = useWebsite();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newWebsite, setNewWebsite] = useState({
    name: "",
    domain: "",
    theme: "default"
  });

  const handleCreateWebsite = async () => {
    if (!newWebsite.name.trim() || !newWebsite.domain.trim()) {
      return;
    }
    
    try {
      await createWebsite(newWebsite.name, newWebsite.domain, newWebsite.theme);
      setNewWebsite({ name: "", domain: "", theme: "default" });
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Failed to create website:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-md">
        <Globe className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="justify-between min-w-[180px]">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span className="truncate">
                {selectedWebsite?.name || "Select Website"}
              </span>
            </div>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[200px]" align="start">
          {websites.map((website) => (
            <DropdownMenuItem
              key={website._id}
              onClick={() => setSelectedWebsiteId(website._id)}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex flex-col">
                <span className="font-medium">{website.name}</span>
                <span className="text-xs text-muted-foreground">{website.domain}</span>
              </div>
              {selectedWebsite?._id === website._id && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Website
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Website</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Website Name</Label>
                  <Input 
                    id="name" 
                    placeholder="My Company Site"
                    value={newWebsite.name}
                    onChange={(e) => setNewWebsite(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="domain">Domain</Label>
                  <Input 
                    id="domain" 
                    placeholder="mycompany.com"
                    value={newWebsite.domain}
                    onChange={(e) => setNewWebsite(prev => ({ ...prev, domain: e.target.value }))}
                  />
                </div>
                <Button 
                  onClick={handleCreateWebsite}
                  className="w-full"
                  disabled={!newWebsite.name.trim() || !newWebsite.domain.trim()}
                >
                  Create Website
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
