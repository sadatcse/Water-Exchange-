'use client';
import useApi from '@/hooks/useApi';

// Product category list (flat, with product counts) for the dashboard — see src/data/product-categories.js
export default function useProductCategories() {
  return useApi('/product-categories', { initialData: [], select: (res) => res.data });
}
