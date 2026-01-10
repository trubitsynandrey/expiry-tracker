import { useMutation } from '@tanstack/react-query';
import { supabase } from './supabase';


const deleteProduct = async (id: string): Promise<void> => {
  // First, delete the image(s) from the bucket
  const { data: listData, error: listError } = await supabase.storage
    .from('product-images')
    .list(id + '/');

  if (listError) {
    console.error('Error listing images for deletion:', listError);
    // Continue to try deleting the product anyway
  } else if (listData && listData.length > 0) {
    // Delete all files under the product's folder
    const filePaths = listData.map((file: any) => `${id}/${file.name}`);
    const { error: deleteImgError } = await supabase.storage
      .from('product-images')
      .remove(filePaths);
    if (deleteImgError) {
      console.error('Error deleting image(s) from bucket:', deleteImgError);
    }
  }

  // Then, delete the product from the table
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