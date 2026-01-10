import { supabase } from '@/api/supabase';
import { useMutation } from '@tanstack/react-query';

export interface ImagePayload {
  buffer: ArrayBuffer;
  name: string;
  type: string;
}

interface NewProduct {
  id: string;
  name: string;
  description: string;
  expired_at: string;
  imageFile?: ImagePayload; // Added optional image file
}

async function uploadImageToBucket(
  image: ImagePayload,
  productId: string
): Promise<string | null> {

  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(
      `${productId}/${image.name}`,
      image.buffer,
      {
        contentType: image.type,
        upsert: true,
      }
    );

  if (error) {
    console.error('Error uploading image:', error);
    return null;
  }

  return supabase.storage
    .from('product-images')
    .getPublicUrl(data.path).data.publicUrl;
}


async function addProduct(newProduct: NewProduct): Promise<any | null> {
  let imageUrl = null;

  if (newProduct.imageFile) {
  imageUrl = await uploadImageToBucket(
    newProduct.imageFile,
    newProduct.id
  );
}

  const newProductToSend = { ...newProduct, image_url: imageUrl };
  delete newProductToSend.imageFile; // Remove imageFile before sending to DB

  const { data, error } = await supabase
    .from('Product')
    .insert([newProductToSend])
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