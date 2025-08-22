import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface ProductFormData {
  name: string;
  sku: string;
  category: string;
  description?: string;
  price: number;
  stock_quantity: number;
  status: 'active' | 'draft' | 'inactive';
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  tags?: string[];
  image_url?: string;
  low_stock_threshold?: number;
}

interface ProductFormProps {
  product?: any;
  onSubmit: (product: ProductFormData) => void;
  onCancel: () => void;
}

const ProductForm = ({ product, onSubmit, onCancel }: ProductFormProps) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: product?.name || '',
    sku: product?.sku || '',
    category: product?.category || '',
    description: product?.description || '',
    price: product?.price || 0,
    stock_quantity: product?.stock_quantity || 0,
    weight: product?.weight || 0,
    dimensions: product?.dimensions || { length: 0, width: 0, height: 0 },
    tags: product?.tags || [],
    status: product?.status || 'draft',
    image_url: product?.image_url || '',
    low_stock_threshold: product?.low_stock_threshold || 10,
  });

  const [newTag, setNewTag] = useState('');

  // Generate SKU based on product name
  const generateSKU = (name: string) => {
    return name
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .substring(0, 8) + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
  };

  // Auto-generate SKU when name changes and SKU is empty
  useEffect(() => {
    if (formData.name && !formData.sku) {
      setFormData(prev => ({ ...prev, sku: generateSKU(prev.name) }));
    }
  }, [formData.name]);

  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDimensionChange = (dimension: keyof NonNullable<ProductFormData['dimensions']>, value: number) => {
    setFormData(prev => ({
      ...prev,
      dimensions: { ...prev.dimensions, [dimension]: value }
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{product ? 'Edit Product' : 'Create New Product'}</CardTitle>
        <CardDescription>
          {product ? 'Update product information' : 'Add a new product to your catalog'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter product name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku">SKU *</Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => handleInputChange('sku', e.target.value)}
                  placeholder="Product SKU (auto-generated)"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleInputChange('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Fashion">Fashion</SelectItem>
                    <SelectItem value="Home & Kitchen">Home & Kitchen</SelectItem>
                    <SelectItem value="Sports & Outdoors">Sports & Outdoors</SelectItem>
                    <SelectItem value="Books">Books</SelectItem>
                    <SelectItem value="Health & Beauty">Health & Beauty</SelectItem>
                    <SelectItem value="Toys & Games">Toys & Games</SelectItem>
                    <SelectItem value="Automotive">Automotive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange('status', value as 'active' | 'draft' | 'inactive')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Product description"
                rows={3}
              />
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Pricing & Inventory</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (₹) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock Quantity *</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock_quantity}
                  onChange={(e) => handleInputChange('stock_quantity', parseInt(e.target.value) || 0)}
                  placeholder="0"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lowStockThreshold">Low Stock Alert</Label>
                <Input
                  id="lowStockThreshold"
                  type="number"
                  value={formData.low_stock_threshold}
                  onChange={(e) => handleInputChange('low_stock_threshold', parseInt(e.target.value) || 10)}
                  placeholder="10"
                />
              </div>
            </div>
          </div>

          {/* Physical Properties */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Physical Properties</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.01"
                  value={formData.weight || ''}
                  onChange={(e) => handleInputChange('weight', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="length">Length (cm)</Label>
                <Input
                  id="length"
                  type="number"
                  step="0.1"
                  value={formData.dimensions?.length || ''}
                  onChange={(e) => handleDimensionChange('length', parseFloat(e.target.value) || 0)}
                  placeholder="0.0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="width">Width (cm)</Label>
                <Input
                  id="width"
                  type="number"
                  step="0.1"
                  value={formData.dimensions?.width || ''}
                  onChange={(e) => handleDimensionChange('width', parseFloat(e.target.value) || 0)}
                  placeholder="0.0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  step="0.1"
                  value={formData.dimensions?.height || ''}
                  onChange={(e) => handleDimensionChange('height', parseFloat(e.target.value) || 0)}
                  placeholder="0.0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">Product Image URL</Label>
              <Input
                id="imageUrl"
                type="url"
                value={formData.image_url}
                onChange={(e) => handleInputChange('image_url', e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Tags</h3>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a tag and press Enter"
                className="flex-1"
              />
              <Button type="button" onClick={addTag} variant="outline">
                Add Tag
              </Button>
            </div>
            
            {formData.tags && formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {product ? 'Update Product' : 'Create Product'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProductForm;