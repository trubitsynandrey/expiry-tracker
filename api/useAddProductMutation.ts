import { supabase } from '@/api/supabase';
import { useMutation } from '@tanstack/react-query';

interface NewProduct {
  id: string
  name: string;
  description: string;
  expired_at: string;
}


async function addProduct(newProduct: NewProduct): Promise<any | null> {
  const { data, error } = await supabase
    .from('Product')
    .insert([newProduct])
    .single();

  if (error) {
    console.error('Error adding product:', error);
    return null;
  }

  return data;
}

export const useAddProductMutation = () => {
  return useMutation({
    mutationFn: addProduct,
  });
};