import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Product } from '@/types/product';

interface ProductContextType {
  product: Product | null;
  loading: boolean;
  error: Error | null;
  refreshProduct: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType>({
  product: null,
  loading: false,
  error: null,
  refreshProduct: async () => {},
});

export const useProduct = () => useContext(ProductContext);

interface ProductProviderProps {
  productId: string;
  children: React.ReactNode;
}

export const ProductProvider = ({ productId, children }: ProductProviderProps) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('products')
        .select(`
          *,
          seller:users!products_seller_id_fkey (
            whatsapp_number
          ),
          images:product_images (
            id,
            url,
            alt,
            order_number
          )
        `)
        .eq('id', productId)
        .single();

      if (fetchError) throw fetchError;

      if (data) {
        setProduct({
          ...data,
          images: data.images || [],
          sellerWhatsApp: data.seller?.whatsapp_number
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch product'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  return (
    <ProductContext.Provider
      value={{
        product,
        loading,
        error,
        refreshProduct: fetchProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export default ProductProvider;