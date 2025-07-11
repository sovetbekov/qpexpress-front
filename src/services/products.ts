"use server";

import { makeRequest } from "@/services/utils";

// Types for the products API
export interface ProductItem {
  productId: string;
  poolTotal: number;
}

// Types for detailed product information
export interface ProductAttribute {
  attrId: string;
  attrName: string;
  attrNameCn: string;
  value: string;
  valueCn: string;
}

// Update your ProductDetails interface to match the actual API response structure
export interface ProductDetails {
  status: string;

    code: number;
    msg: string;
    data: Array<{
      productId: string;
      title: string;
      titleCn: string;
      categoryId: string;
      description: string;
      mainVideo?: string;
      images: string[];
      attributes: ProductAttribute[];
      skuInfos?: any[];
      saleInfo?: any;
      minOrderQuantity?: number;
      sellerDataInfo?: any;
      status?: string;
    }>;
    requestId: string;

}

/**
 * Fetches a paginated list of products from the API
 *
 * @param {Object} options - Request parameters
 * @param {string} options.language - The language code (e.g., 'en', 'ru')
 * @param {number} options.pageSize - Number of items per page
 * @param {number} options.currentPage - Current page number
 * @returns {Promise<ProductItem[]>} A promise resolving to the product list
 */
export async function getProducts({
  language = "en",
  pageSize = 10,
  currentPage = 1,
} = {}) {
  return await makeRequest<ProductItem[]>("v1/yatobuy-client/products", {
    requestOptions: {
      method: "POST",
      body: JSON.stringify({ language, pageSize, currentPage }),
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    },
  });
}

/**
 * Fetches detailed information for a specific product
 *
 * @param {string|number} productId - The ID of the product to fetch details for
 * @param {string} language - The language code (e.g., 'en', 'ru')
 * @returns {Promise<ProductDetails>} A promise resolving to the detailed product information
 */
export async function getProductDetails(
  productId: string | number,
  language: string = "en"
) {
  return await makeRequest<ProductDetails>(
    "v1/yatobuy-client/product-details",
    {
      requestOptions: {
        method: "POST",
        body: JSON.stringify({ productId, language }),
        headers: {
          "Content-Type": "application/json",
        },
        next: {
          tags: [`product-${productId}`],
        },
      },
    }
  );
}
