import { useMutation } from '@tanstack/react-query';
import { supabase } from './supabase';


const deleteProduct = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('Product')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Error deleting product: ${error.message}`);
  }
};

export const useDeleteProductMutation = () => {
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
    },
    onError: (error) => {
    },
  });
};