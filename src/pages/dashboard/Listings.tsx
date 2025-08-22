import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Search, Plus, Edit, Eye, Copy, Upload, Download, Filter, 
  AlertTriangle, CheckCircle, Clock, XCircle, Package, TrendingUp 
} from 'lucide-react';
import ProductForm from '@/components/ProductForm';
import CSVImport from '@/components/CSVImport';
import useProductManagement, { Product } from '@/hooks/useProductManagement';

const Listings = () => {
  const {
    products,
    loading,
    filters,
    setFilters,
    createProduct,
    updateProduct,
    deleteProduct,
    duplicateProduct,
    bulkUpdateStatus,
    getProductStats,
    getCategories,
    exportToCSV,
  } = useProductManagement();

  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [isCSVImportOpen, setIsCSVImportOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const stats = getProductStats();
  const categories = getCategories();

  const getStatusBadge = (status: string) => {
    const config = {
      'active': { variant: 'default', icon: CheckCircle, color: 'text-green-600' },
      'draft': { variant: 'secondary', icon: Clock, color: 'text-yellow-600' },
      'inactive': { variant: 'outline', icon: XCircle, color: 'text-red-600' },
    } as const;

    const { variant, icon: Icon, color } = config[status as keyof typeof config] || config.draft;
    return (
      <Badge variant={variant} className="flex items-center gap-1">
        <Icon className={`h-3 w-3 ${color}`} />
        {status}
      </Badge>
    );
  };

  const getStockBadge = (stock: number, threshold: number = 10) => {
    if (stock === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    }
    if (stock <= threshold) {
      return <Badge variant="outline" className="text-orange-600 border-orange-600">Low Stock</Badge>;
    }
    return <Badge variant="secondary" className="text-green-600">In Stock</Badge>;
  };

  const filteredProducts = products.filter(product => {
    let matches = true;

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      matches = matches && (
        product.name.toLowerCase().includes(searchLower) ||
        product.sku.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower)
      );
    }

    if (filters.category && filters.category !== 'all') {
      matches = matches && product.category === filters.category;
    }

    if (filters.status && filters.status !== 'all') {
      matches = matches && product.status === filters.status;
    }

    return matches;
  });

  const handleProductSubmit = async (productData: Omit<Product, 'id'>) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
      } else {
        await createProduct(productData);
      }
      setIsProductFormOpen(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsProductFormOpen(true);
  };

  const handleDuplicateProduct = async (product: Product) => {
    try {
      await duplicateProduct(product);
    } catch (error) {
      console.error('Error duplicating product:', error);
    }
  };

  const handleCSVImport = async (importedProducts: any[]) => {
    try {
      for (const productData of importedProducts) {
        await createProduct({
          name: productData.name,
          sku: productData.sku,
          category: productData.category,
          description: productData.description,
          price: parseFloat(productData.price),
          stock_quantity: parseInt(productData.stock),
          status: productData.status || 'draft',
          weight: productData.weight ? parseFloat(productData.weight) : undefined,
          image_url: productData.image_url,
          low_stock_threshold: productData.low_stock_threshold ? parseInt(productData.low_stock_threshold) : 10,
        });
      }
      setIsCSVImportOpen(false);
    } catch (error) {
      console.error('Error importing products:', error);
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedProducts.length === 0) return;

    switch (action) {
      case 'activate':
        await bulkUpdateStatus(selectedProducts, 'active');
        break;
      case 'deactivate':
        await bulkUpdateStatus(selectedProducts, 'inactive');
        break;
      case 'draft':
        await bulkUpdateStatus(selectedProducts, 'draft');
        break;
    }
    setSelectedProducts([]);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(filteredProducts.map(p => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts(prev => [...prev, productId]);
    } else {
      setSelectedProducts(prev => prev.filter(id => id !== productId));
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading products...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Product Listings</h1>
        <div className="flex gap-2">
          <Dialog open={isCSVImportOpen} onOpenChange={setIsCSVImportOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Import CSV
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Import Products from CSV</DialogTitle>
                <DialogDescription>
                  Upload a CSV file to bulk import products
                </DialogDescription>
              </DialogHeader>
              <CSVImport
                onImport={handleCSVImport}
                onClose={() => setIsCSVImportOpen(false)}
              />
            </DialogContent>
          </Dialog>
          
          <Button variant="outline" onClick={exportToCSV}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          
          <Dialog open={isProductFormOpen} onOpenChange={setIsProductFormOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingProduct(null)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? 'Edit Product' : 'Create New Product'}
                </DialogTitle>
                <DialogDescription>
                  {editingProduct ? 'Update product information' : 'Add a new product to your catalog'}
                </DialogDescription>
              </DialogHeader>
              <ProductForm
                product={editingProduct || undefined}
                onSubmit={handleProductSubmit}
                onCancel={() => {
                  setIsProductFormOpen(false);
                  setEditingProduct(null);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{Math.floor(stats.total * 0.1)}</span> this month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-xs text-muted-foreground">Currently selling</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.draft}</div>
            <p className="text-xs text-muted-foreground">Pending review</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.lowStock}</div>
            <p className="text-xs text-muted-foreground">Need restocking</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conversionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+0.5%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All Products ({stats.total})</TabsTrigger>
            <TabsTrigger value="active">Active ({stats.active})</TabsTrigger>
            <TabsTrigger value="draft">Drafts ({stats.draft})</TabsTrigger>
            <TabsTrigger value="inactive">Inactive ({stats.inactive})</TabsTrigger>
          </TabsList>

          {selectedProducts.length > 0 && (
            <div className="flex gap-2">
              <span className="text-sm text-muted-foreground">
                {selectedProducts.length} selected
              </span>
              <Button size="sm" variant="outline" onClick={() => handleBulkAction('activate')}>
                Activate
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleBulkAction('deactivate')}>
                Deactivate
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleBulkAction('draft')}>
                Move to Draft
              </Button>
            </div>
          )}
        </div>

        <div className="flex gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products, SKUs, or descriptions..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="pl-10"
            />
          </div>
          
          <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value })}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={filters.sortBy} onValueChange={(value) => setFilters({ ...filters, sortBy: value })}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at">Date Created</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="price">Price</SelectItem>
              <SelectItem value="stock_quantity">Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Product Management</CardTitle>
              <CardDescription>
                Create, edit and manage your product listings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedProducts.includes(product.id)}
                          onCheckedChange={(checked) => handleSelectProduct(product.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {product.image_url ? (
                            <img 
                              src={product.image_url} 
                              alt={product.name}
                              className="w-12 h-12 rounded object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
                              <Package className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground">{product.sku}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.category}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        ₹{product.price.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{product.stock_quantity}</div>
                          {getStockBadge(product.stock_quantity, product.low_stock_threshold)}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(product.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" title="View Details">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleEditProduct(product)}
                            title="Edit Product"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDuplicateProduct(product)}
                            title="Duplicate Product"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {filteredProducts.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No products found. Try adjusting your filters or add some products.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Active Products</h3>
                <p className="text-muted-foreground mb-4">
                  {stats.active} products are currently active and selling
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="draft">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Draft Products</h3>
                <p className="text-muted-foreground mb-4">
                  {stats.draft} products are in draft status and need review
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inactive">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <XCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Inactive Products</h3>
                <p className="text-muted-foreground mb-4">
                  {stats.inactive} products are currently inactive
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Listings;