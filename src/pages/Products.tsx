import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Package, Eye, Search, Filter, Grid, List, Image, Star, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { useWebsite } from '@/hooks/useWebsite';
import { useToast } from '@/hooks/use-toast';

// Mock data types
interface Product {
  id: string;
  name: string;
  description?: string;
  price?: number;
  sku?: string;
  categoryId?: string;
  stockQuantity: number;
  status: 'active' | 'inactive' | 'out_of_stock';
  images: string[];
  rating: number;
  reviews: number;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: string;
  name: string;
  description?: string;
}

// Mock data
const mockCategories: Category[] = [
  { id: '1', name: 'Electronics', description: 'Electronic devices and gadgets' },
  { id: '2', name: 'Clothing', description: 'Fashion and apparel' },
  { id: '3', name: 'Home & Garden', description: 'Home decoration and garden tools' },
  { id: '4', name: 'Books', description: 'Books and educational materials' },
  { id: '5', name: 'Sports', description: 'Sports equipment and accessories' },
];

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.',
    price: 199.99,
    sku: 'WBH-001',
    categoryId: '1',
    stockQuantity: 45,
    status: 'active',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop'],
    rating: 4.5,
    reviews: 128,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z'
  },
  {
    id: '2',
    name: 'Premium Cotton T-Shirt',
    description: 'Comfortable 100% organic cotton t-shirt available in multiple colors. Eco-friendly and sustainable fashion choice.',
    price: 29.99,
    sku: 'PCT-002',
    categoryId: '2',
    stockQuantity: 120,
    status: 'active',
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop'],
    rating: 4.2,
    reviews: 89,
    createdAt: '2024-01-16T10:00:00Z',
    updatedAt: '2024-01-21T10:00:00Z'
  },
  {
    id: '3',
    name: 'Smart Home Security Camera',
    description: '4K HD security camera with night vision, motion detection, and mobile app control.',
    price: 149.99,
    sku: 'SHSC-003',
    categoryId: '1',
    stockQuantity: 0,
    status: 'out_of_stock',
    images: ['https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=300&fit=crop'],
    rating: 4.7,
    reviews: 234,
    createdAt: '2024-01-17T10:00:00Z',
    updatedAt: '2024-01-22T10:00:00Z'
  },
  {
    id: '4',
    name: 'Ceramic Plant Pot Set',
    description: 'Beautiful set of 3 ceramic plant pots with drainage holes. Perfect for indoor plants and home decoration.',
    price: 39.99,
    sku: 'CPPS-004',
    categoryId: '3',
    stockQuantity: 75,
    status: 'active',
    images: ['https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=300&h=300&fit=crop'],
    rating: 4.3,
    reviews: 67,
    createdAt: '2024-01-18T10:00:00Z',
    updatedAt: '2024-01-23T10:00:00Z'
  },
  {
    id: '5',
    name: 'JavaScript Programming Guide',
    description: 'Complete guide to modern JavaScript programming with practical examples and exercises.',
    price: 49.99,
    sku: 'JPG-005',
    categoryId: '4',
    stockQuantity: 200,
    status: 'active',
    images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=300&fit=crop'],
    rating: 4.8,
    reviews: 156,
    createdAt: '2024-01-19T10:00:00Z',
    updatedAt: '2024-01-24T10:00:00Z'
  },
  {
    id: '6',
    name: 'Yoga Mat Premium',
    description: 'Non-slip premium yoga mat with alignment lines. Eco-friendly and durable for all yoga practices.',
    price: 79.99,
    sku: 'YMP-006',
    categoryId: '5',
    stockQuantity: 30,
    status: 'active',
    images: ['https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=300&fit=crop'],
    rating: 4.4,
    reviews: 92,
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-25T10:00:00Z'
  },
  {
    id: '7',
    name: 'Vintage Leather Jacket',
    description: 'Premium genuine leather jacket with vintage styling. Timeless fashion piece for any wardrobe.',
    price: 299.99,
    sku: 'VLJ-007',
    categoryId: '2',
    stockQuantity: 15,
    status: 'inactive',
    images: ['https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=300&h=300&fit=crop'],
    rating: 4.6,
    reviews: 43,
    createdAt: '2024-01-21T10:00:00Z',
    updatedAt: '2024-01-26T10:00:00Z'
  },
  {
    id: '8',
    name: 'LED Desk Lamp',
    description: 'Adjustable LED desk lamp with touch control and USB charging port. Energy efficient and modern design.',
    price: 89.99,
    sku: 'LDL-008',
    categoryId: '3',
    stockQuantity: 60,
    status: 'active',
    images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop'],
    rating: 4.1,
    reviews: 78,
    createdAt: '2024-01-22T10:00:00Z',
    updatedAt: '2024-01-27T10:00:00Z'
  }
];

export default function Products() {
  const { selectedWebsite } = useWebsite();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [categories] = useState<Category[]>(mockCategories);
  const [loading, setLoading] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    sku: '',
    categoryId: '',
    stockQuantity: '0',
    status: 'active' as 'active' | 'inactive' | 'out_of_stock',
    images: [] as string[],
  });

  // Filter products based on search and filters
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || product.categoryId === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || product.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const productData: Product = {
        id: editingProduct?.id || Date.now().toString(),
        name: formData.name,
        description: formData.description || undefined,
        price: formData.price ? parseFloat(formData.price) : undefined,
        sku: formData.sku || undefined,
        categoryId: formData.categoryId || undefined,
        stockQuantity: parseInt(formData.stockQuantity) || 0,
        status: formData.status,
        images: formData.images,
        rating: editingProduct?.rating || 0,
        reviews: editingProduct?.reviews || 0,
        createdAt: editingProduct?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (editingProduct) {
        setProducts(prev => prev.map(p => p.id === editingProduct.id ? productData : p));
        toast({
          title: "Product updated",
          description: "Product has been updated successfully.",
        });
      } else {
        setProducts(prev => [...prev, productData]);
        toast({
          title: "Product created",
          description: "New product has been created successfully.",
        });
      }

      setIsCreateDialogOpen(false);
      setEditingProduct(null);
      resetForm();
    } catch (error) {
      console.error('Failed to save product:', error);
      toast({
        title: "Error",
        description: "Failed to save product.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      sku: '',
      categoryId: '',
      stockQuantity: '0',
      status: 'active',
      images: [],
    });
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price?.toString() || '',
      sku: product.sku || '',
      categoryId: product.categoryId || '',
      stockQuantity: product.stockQuantity.toString(),
      status: product.status,
      images: product.images || [],
    });
    setIsCreateDialogOpen(true);
  };

  const handleDelete = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    toast({
      title: "Product deleted",
      description: "Product has been deleted successfully.",
    });
  };

  const handleBulkDelete = () => {
    if (selectedProducts.length === 0) return;
    
    setProducts(prev => prev.filter(p => !selectedProducts.includes(p.id)));
    setSelectedProducts([]);
    toast({
      title: "Products deleted",
      description: `${selectedProducts.length} product(s) have been deleted.`,
    });
  };

  const handleSelectProduct = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts(prev => [...prev, productId]);
    } else {
      setSelectedProducts(prev => prev.filter(id => id !== productId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(filteredProducts.map(p => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'inactive': return 'secondary';
      case 'out_of_stock': return 'destructive';
      default: return 'secondary';
    }
  };

  const getCategoryName = (categoryId?: string) => {
    if (!categoryId) return 'No Category';
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Unknown Category';
  };

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { label: 'Out of Stock', variant: 'destructive' as const };
    if (quantity < 10) return { label: 'Low Stock', variant: 'secondary' as const };
    return { label: 'In Stock', variant: 'default' as const };
  };

  if (!selectedWebsite) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto p-6 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Select a Website</h3>
            <p className="text-muted-foreground">Please select a website to manage products.</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Products</h1>
            <p className="text-muted-foreground">Manage your product catalog for {selectedWebsite.name}</p>
          </div>
          
          <div className="flex items-center gap-2">
            {selectedProducts.length > 0 && (
              <Button variant="destructive" onClick={handleBulkDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected ({selectedProducts.length})
              </Button>
            )}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingProduct ? 'Edit Product' : 'Create Product'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Product Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Enter product name"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="price">Price</Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          placeholder="0.00"
                        />
                      </div>

                      <div>
                        <Label htmlFor="sku">SKU</Label>
                        <Input
                          id="sku"
                          value={formData.sku}
                          onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                          placeholder="Product SKU"
                        />
                      </div>

                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">No Category</SelectItem>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="stock">Stock Quantity</Label>
                        <Input
                          id="stock"
                          type="number"
                          value={formData.stockQuantity}
                          onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                          placeholder="0"
                        />
                      </div>

                      <div>
                        <Label htmlFor="status">Status</Label>
                        <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as any })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Enter product description"
                      rows={4}
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsCreateDialogOpen(false);
                        setEditingProduct(null);
                        resetForm();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingProduct ? 'Update Product' : 'Create Product'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center border rounded-md">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products */}
        {filteredProducts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {products.length === 0 ? 'No products yet' : 'No products found'}
              </h3>
              <p className="text-muted-foreground text-center mb-4">
                {products.length === 0 
                  ? 'Get started by creating your first product'
                  : 'Try adjusting your search or filter criteria'
                }
              </p>
              {products.length === 0 && (
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {/* Select All */}
            <div className="flex items-center gap-2 px-1">
              <Checkbox
                checked={selectedProducts.length === filteredProducts.length}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm text-muted-foreground">
                Select all ({filteredProducts.length} products)
              </span>
            </div>

            {/* Products Grid/List */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                    <CardHeader className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <Checkbox
                          checked={selectedProducts.includes(product.id)}
                          onCheckedChange={(checked) => handleSelectProduct(product.id, checked as boolean)}
                        />
                        <Badge variant={getStatusBadgeVariant(product.status)}>
                          {product.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      {product.images[0] ? (
                        <div className="aspect-square bg-muted rounded-lg overflow-hidden mb-3">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                      ) : (
                        <div className="aspect-square bg-muted rounded-lg flex items-center justify-center mb-3">
                          <Image className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                      
                      <div>
                        <CardTitle className="text-lg line-clamp-1">{product.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {getCategoryName(product.categoryId)}
                        </p>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="p-4 pt-0">
                      {product.description && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {product.description}
                        </p>
                      )}
                      
                      <div className="space-y-2 mb-4">
                        {product.price && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Price:</span>
                            <span className="font-semibold text-lg">${product.price}</span>
                          </div>
                        )}
                        {product.sku && (
                          <div className="flex justify-between">
                            <span className="text-sm">SKU:</span>
                            <span className="font-mono text-sm">{product.sku}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Stock:</span>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{product.stockQuantity}</span>
                            <Badge {...getStockStatus(product.stockQuantity)} className="text-xs">
                              {getStockStatus(product.stockQuantity).label}
                            </Badge>
                          </div>
                        </div>
                        
                        {product.rating > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Rating:</span>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium">{product.rating}</span>
                              <span className="text-sm text-muted-foreground">({product.reviews})</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(product)}
                          className="flex-1"
                        >
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {filteredProducts.map((product) => (
                      <div key={product.id} className="p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <Checkbox
                            checked={selectedProducts.includes(product.id)}
                            onCheckedChange={(checked) => handleSelectProduct(product.id, checked as boolean)}
                          />
                          
                          {product.images[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                              <Image className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold truncate">{product.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {getCategoryName(product.categoryId)} • SKU: {product.sku || 'N/A'}
                            </p>
                            {product.description && (
                              <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                                {product.description}
                              </p>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-8">
                            <div className="text-right">
                              <div className="font-semibold">${product.price || 0}</div>
                              <div className="text-sm text-muted-foreground">
                                Stock: {product.stockQuantity}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Badge variant={getStatusBadgeVariant(product.status)}>
                                {product.status.replace('_', ' ')}
                              </Badge>
                              {product.rating > 0 && (
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                  <span className="text-sm">{product.rating}</span>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(product)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(product.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}