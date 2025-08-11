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
 * Search for products using keyword (client-side)
 *
 * @param {SearchProductsRequest} params - Search parameters
 * @returns {Promise<SearchProductsResponse>} A promise resolving to the search results
 */
export async function searchProducts(params: SearchProductsRequest): Promise<SearchProductsResponse> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!backendUrl) {
    throw new Error("NEXT_PUBLIC_BACKEND_URL is not configured");
  }

  const response = await fetch(`${backendUrl}/v1/yatobuy-client/search-products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to search products: ${response.status}`);
  }

  return await response.json();
}


