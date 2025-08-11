"use server";

import { makeRequest } from "@/services/utils";

// Types for the search products API
export interface SearchProductsRequest {
  pageSize: number;
  currentPage: number;
  keyword: string;
}

export interface ProductSearchResult {
  productId: string;
  mainImageUrl: string;
  title: string;
  titleCn: string;
  price: number;
  repurchaseRate: string;
  monthSold: number;
  tradeScore: string;
  firstCategoryId: number;
  secondCategoryId: number;
  thirdCategoryId: number;
}

export interface SearchProductsData {
  totalRecords: number;
  totalPage: number;
  pageSize: number;
  currentPage: number;
  records: ProductSearchResult[];
}

export interface SearchProductsResponse {
  code: number;
  msg: string;
  data: SearchProductsData[];
  requestId: string;
}

// Types for detailed product information (keep for reference if needed)
export interface ProductAttribute {
  attrId: string;
  attrName: string;
  attrNameCn: string;
  value: string;
  valueCn: string;
}

// Excel generation request type
export interface ExcelGenerationRequest {
  pageSize: number;
  currentPage: number;
  keyword: string;
}

/**
 * Search for products using keyword
 *
 * @param {SearchProductsRequest} params - Search parameters
 * @returns {Promise<SearchProductsResponse>} A promise resolving to the search results
 */
export async function searchProducts(params: SearchProductsRequest) {
  return await makeRequest<SearchProductsResponse>("v1/yatobuy-client/search-products", {
    requestOptions: {
      method: "POST",
      body: JSON.stringify(params),
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    },
  });
}

/**
 * Generate Excel file for searched products
 *
 * @param {ExcelGenerationRequest} params - Excel generation parameters
 * @returns {Promise<Blob>} A promise resolving to the Excel file blob
 */
export async function generateProductsExcel(params: ExcelGenerationRequest) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!backendUrl) {
    throw new Error('NEXT_PUBLIC_BACKEND_URL is not configured');
  }

  // Special handling for file download
  const response = await fetch(`${backendUrl}/v1/yatobuy-client/excel`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error(`Failed to generate Excel: ${response.status}`);
  }

  return await response.blob();
}

/**
 * Download Excel file with proper filename
 *
 * @param {ExcelGenerationRequest} params - Excel generation parameters
 * @param {string} filename - Optional filename for the download
 */
export async function downloadProductsExcel(params: ExcelGenerationRequest, filename?: string) {
  const blob = await generateProductsExcel(params);
  
  // Create download link
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `products_${params.keyword}_page${params.currentPage}.xlsx`;
  
  // Trigger download
  document.body.appendChild(link);
  link.click();
  
  // Cleanup
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
