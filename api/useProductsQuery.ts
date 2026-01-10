import { supabase } from '@/api/supabase';
import { useQuery } from '@tanstack/react-query';

interface Product {
  id: string;
  name: string;
  description: string;
  created_at: string;
  expired_at: string;
}

async function fetchAllProducts(): Promise<Product[] | null> {
  let { data: Product, error } = await supabase.from('Product').select('*').order('expired_at', { ascending: true });
  if (error) {
    console.error('Error fetching products:', error);
    return null;
  }

  return Product;
}

export const useProductsQuery = (enabled: boolean = false) => {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchAllProducts,
    enabled,
    refetchOnWindowFocus: true
  });
};