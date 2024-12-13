import type { Product, Filters, SortOption } from '@/types/product';

export const fetchProducts = async (
  page = 0, 
  searchQuery = '', 
  filters: Filters = {}, 
  sortBy: SortOption = 'newest'
): Promise<{ products: Product[], hasMore: boolean }> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const mockProducts: Product[] = Array(12).fill(null).map((_, i) => ({
    id: `${page * 12 + i}`,
    permanentLinkId: (page * 12 + i) % 120 + 1,
    title: `Product ${page * 12 + i + 1}`,
    price: Math.floor(Math.random() * 900) + 100,
    description: 'Product description preview',
    quantity: Math.floor(Math.random() * 10) + 1,
    images: [{
      id: '1',
      url: '/placeholder.svg',
      alt: `Product ${page * 12 + i + 1}`,
      order: 1
    }],
    status: 'active',
    sellerId: '123',
    sellerWhatsApp: '1234567890',
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 86400000).toISOString(),
    viewCount: 0
  }));

  return {
    products: mockProducts,
    hasMore: page < 4 // Simulate 5 pages of data
  };
};