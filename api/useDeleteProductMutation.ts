import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from './supabase';


const deleteProduct = async (id: string): Promise<void> => {
  // 1. Delete images from storage
  const { data: listData, error: listError } = await supabase.storage
    .from('product-images')
    .list(`${id}/`);

  if (!listError && listData?.length) {
    const filePaths = listData.map(file => `${id}/${file.name}`);
    await supabase.storage
      .from('product-images')
      .remove(filePaths);
  }

  // 2. Delete product row
  const { error } = await supabase
    .from('Product')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
};

export const useDeleteProductMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: (_data, id) => {
      queryClient.setQueryData(['products'], (old: any) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.filter((product: any) => product.id !== id),
        };
      });
    },
  });
};
