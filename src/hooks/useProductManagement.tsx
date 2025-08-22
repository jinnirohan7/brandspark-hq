import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type ProductRow = Database['public']['Tables']['products']['Row'];
type ProductInsert = Database['public']['Tables']['products']['Insert'];

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  description?: string | null;
  price: number;
  stock_quantity: number;
  status: 'active' | 'draft' | 'inactive';
  weight?: number | null;
  dimensions?: any;
  image_url?: string | null;
  low_stock_threshold?: number | null;
  created_at: string;
  updated_at: string;
  seller_id: string;
}

export interface ProductFilters {
  search: string;
  category: string;
  status: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface ProductStats {
  total: number;
  active: number;
  draft: number;
  inactive: number;
  lowStock: number;
  totalViews: number;
  conversionRate: number;
}

const useProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ProductFilters>({
    search: '',
    category: '',
    status: '',
    sortBy: 'created_at',
    sortOrder: 'desc',
  });
  const { toast } = useToast();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('products')
        .select('*')
        .order(filters.sortBy, { ascending: filters.sortOrder === 'asc' });

      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,sku.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      if (filters.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }

      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      const { data, error } = await query;

      if (error) throw error;
      setProducts((data || []).map(item => ({
        ...item,
        status: item.status as 'active' | 'draft' | 'inactive'
      })));
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'seller_id'>) => {
    try {
      const insertData = {
        name: productData.name,
        sku: productData.sku,
        category: productData.category,
        description: productData.description || null,
        price: productData.price,
        stock_quantity: productData.stock_quantity,
        status: productData.status || 'draft',
        weight: productData.weight || null,
        dimensions: productData.dimensions || null,
        image_url: productData.image_url || null,
        low_stock_threshold: productData.low_stock_threshold || null,
      };

      const { data, error } = await supabase
        .from('products')
        .insert(insertData as any)
        .select()
        .single();

      if (error) throw error;
      
      setProducts(prev => [{
        ...data,
        status: data.status as 'active' | 'draft' | 'inactive'
      }, ...prev]);
      toast({
        title: "Success",
        description: "Product created successfully",
      });
      return data;
    } catch (error) {
      console.error('Error creating product:', error);
      toast({
        title: "Error",
        description: "Failed to create product",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setProducts(prev => prev.map(p => p.id === id ? { 
        ...p, 
        ...data,
        status: data.status as 'active' | 'draft' | 'inactive'
      } : p));
      toast({
        title: "Success",
        description: "Product updated successfully",
      });
      return data;
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setProducts(prev => prev.filter(p => p.id !== id));
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
      throw error;
    }
  };

  const duplicateProduct = async (product: Product) => {
    try {
      const duplicatedProduct = {
        ...product,
        name: `${product.name} (Copy)`,
        sku: `${product.sku}-COPY`,
        status: 'draft' as const,
      };
      delete (duplicatedProduct as any).id;
      delete (duplicatedProduct as any).created_at;
      delete (duplicatedProduct as any).updated_at;
      delete (duplicatedProduct as any).seller_id;

      return await createProduct(duplicatedProduct);
    } catch (error) {
      console.error('Error duplicating product:', error);
      throw error;
    }
  };

  const bulkUpdateStatus = async (productIds: string[], status: Product['status']) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ status })
        .in('id', productIds);

      if (error) throw error;
      
      setProducts(prev => prev.map(p => 
        productIds.includes(p.id) ? { ...p, status } : p
      ));
      
      toast({
        title: "Success",
        description: `${productIds.length} products updated successfully`,
      });
    } catch (error) {
      console.error('Error bulk updating products:', error);
      toast({
        title: "Error",
        description: "Failed to update products",
        variant: "destructive",
      });
      throw error;
    }
  };

  const getProductStats = (): ProductStats => {
    const total = products.length;
    const active = products.filter(p => p.status === 'active').length;
    const draft = products.filter(p => p.status === 'draft').length;
    const inactive = products.filter(p => p.status === 'inactive').length;
    const lowStock = products.filter(p => 
      p.stock_quantity <= (p.low_stock_threshold || 10)
    ).length;
    
    return {
      total,
      active,
      draft,
      inactive,
      lowStock,
      totalViews: Math.floor(total * 150 + Math.random() * 500), // Mock data
      conversionRate: 3.2 + Math.random() * 2, // Mock data
    };
  };

  const getCategories = () => {
    const categories = [...new Set(products.map(p => p.category))];
    return categories.sort();
  };

  const exportToCSV = () => {
    const headers = [
      'Name', 'SKU', 'Category', 'Description', 'Price', 'Stock', 'Status', 
      'Weight', 'Image URL', 'Low Stock Threshold'
    ];
    
    const csvData = products.map(product => [
      product.name,
      product.sku,
      product.category,
      product.description || '',
      product.price,
      product.stock_quantity,
      product.status,
      product.weight || '',
      product.image_url || '',
      product.low_stock_threshold || ''
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `products-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  return {
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
    refetch: fetchProducts,
  };
};

export default useProductManagement;