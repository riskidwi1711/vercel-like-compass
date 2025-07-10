import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Package, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useWebsite } from '@/hooks/useWebsite';
import { apiService, type Product, type Category } from '@/services/api';
import { toast } from 'sonner';

export default function Products() {
  const { selectedWebsiteId } = useWebsite();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    sku: '',
    categoryId: '',
    stockQuantity: '0',
    status: 'active',
  });

  const loadData = async () => {
    if (!selectedWebsiteId) return;
    
    try {
      setLoading(true);
      const [productsResponse, categoriesResponse] = await Promise.all([
        apiService.getProducts(selectedWebsiteId),
        apiService.getCategories(selectedWebsiteId)
      ]);
      setProducts(productsResponse.data);
      setCategories(categoriesResponse.data);
    } catch (error) {
      console.error('Failed to load data:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedWebsiteId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWebsiteId) return;

    try {
      const productData = {
        name: formData.name,
        description: formData.description || undefined,
        price: formData.price ? parseFloat(formData.price) : undefined,
        sku: formData.sku || undefined,
        categoryId: formData.categoryId || undefined,
        stockQuantity: parseInt(formData.stockQuantity) || 0,
        status: formData.status,
      };

      if (editingProduct) {
        await apiService.updateProduct(selectedWebsiteId, editingProduct._id, productData);
        toast.success('Product updated successfully');
      } else {
        await apiService.createProduct(selectedWebsiteId, productData);
        toast.success('Product created successfully');
      }

      loadData();
      setIsCreateDialogOpen(false);
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        sku: '',
        categoryId: '',
        stockQuantity: '0',
        status: 'active',
      });
    } catch (error) {
      console.error('Failed to save product:', error);
      toast.error('Failed to save product');
    }
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
    });
    setIsCreateDialogOpen(true);
  };

  const handleDelete = async (productId: string) => {
    if (!selectedWebsiteId) return;
    
    try {
      await apiService.deleteProduct(selectedWebsiteId, productId);
      toast.success('Product deleted successfully');
      loadData();
    } catch (error) {
      console.error('Failed to delete product:', error);
      toast.error('Failed to delete product');
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
    const category = categories.find(c => c._id === categoryId);
    return category ? category.name : 'Unknown Category';
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading products...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? 'Edit Product' : 'Create Product'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter product description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
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

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCreateDialogOpen(false);
                    setEditingProduct(null);
                    setFormData({
                      name: '',
                      description: '',
                      price: '',
                      sku: '',
                      categoryId: '',
                      stockQuantity: '0',
                      status: 'active',
                    });
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingProduct ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {products.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No products yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Get started by creating your first product
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product._id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {getCategoryName(product.categoryId)}
                    </p>
                  </div>
                  <Badge variant={getStatusBadgeVariant(product.status)}>
                    {product.status.replace('_', ' ')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {product.description && (
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {product.description}
                  </p>
                )}
                
                <div className="space-y-2 mb-4">
                  {product.price && (
                    <div className="flex justify-between">
                      <span className="text-sm">Price:</span>
                      <span className="font-medium">${product.price}</span>
                    </div>
                  )}
                  {product.sku && (
                    <div className="flex justify-between">
                      <span className="text-sm">SKU:</span>
                      <span className="font-mono text-sm">{product.sku}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-sm">Stock:</span>
                    <span className="font-medium">{product.stockQuantity}</span>
                  </div>
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
                    onClick={() => handleDelete(product._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}