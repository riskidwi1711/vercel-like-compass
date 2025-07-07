import { useState } from "react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Search, Edit, Trash2, Tag, Globe } from "lucide-react";
import { toast } from "sonner";
import { useWebsite } from "@/hooks/useWebsite";

const categoriesData = [
  {
    id: 1,
    name: "Technology",
    description: "Articles about latest technology trends",
    contentCount: 15,
    color: "bg-blue-500"
  },
  {
    id: 2,
    name: "Design",
    description: "UI/UX design tips and tutorials",
    contentCount: 8,
    color: "bg-purple-500"
  },
  {
    id: 3,
    name: "Development",
    description: "Programming and development guides",
    contentCount: 23,
    color: "bg-green-500"
  },
  {
    id: 4,
    name: "Business",
    description: "Business strategy and insights",
    contentCount: 6,
    color: "bg-orange-500"
  }
];

export default function Categories() {
  const { selectedWebsite, selectedWebsiteId } = useWebsite();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });

  const filteredCategories = categoriesData.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateCategory = () => {
    if (!selectedWebsiteId) {
      toast.error("Please select a website first");
      return;
    }
    
    if (!newCategory.name.trim()) {
      toast.error("Category name is required");
      return;
    }
    
    toast.success(`Category "${newCategory.name}" created for ${selectedWebsite?.name}!`);
    setNewCategory({ name: "", description: "" });
    setIsDialogOpen(false);
  };

  const handleEditCategory = (categoryName: string) => {
    toast.info(`Edit category "${categoryName}" functionality coming soon!`);
  };

  const handleDeleteCategory = (categoryName: string) => {
    toast.success(`Category "${categoryName}" deleted successfully!`);
  };

  const handleViewContent = (categoryName: string) => {
    toast.info(`Viewing content for "${categoryName}" category`);
  };

  if (!selectedWebsite) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <DashboardHeader />
        <main className="p-6 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Website Selected</h3>
            <p className="text-muted-foreground">Please select a website to manage categories.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <DashboardHeader />
      
      <main className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
            <p className="text-muted-foreground">
              Organize content for <span className="font-medium">{selectedWebsite.name}</span>
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                New Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Category</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Category Name</Label>
                  <Input 
                    id="name" 
                    placeholder="Enter category name"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input 
                    id="description" 
                    placeholder="Enter description"
                    value={newCategory.description}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <Button 
                  onClick={handleCreateCategory}
                  className="w-full"
                >
                  Create Category
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <div key={category.id} className="bg-white rounded-lg border shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${category.color} flex items-center justify-center`}>
                    <Tag className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleEditCategory(category.name)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDeleteCategory(category.name)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <Badge variant="secondary">
                  {category.contentCount} articles
                </Badge>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleViewContent(category.name)}
                >
                  View Content
                </Button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
