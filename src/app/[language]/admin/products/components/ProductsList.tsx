"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import {
  searchProducts,
  downloadProductsExcel,
  ProductSearchResult,
  SearchProductsRequest,
} from "@/services/products";
import { isError } from "@/app/lib/utils";

interface ProductsListProps {
  language: string;
}

export default function ProductsList({ language }: ProductsListProps) {
  // Note: language parameter is kept for future internationalization
  // but not currently used in the search API
  // Search state
  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Results state
  const [products, setProducts] = useState<ProductSearchResult[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [excelLoading, setExcelLoading] = useState(false);

  // Debounced search function
  const handleSearch = useCallback(
    async (
      searchKeyword: string,
      page: number = 1,
      size: number = pageSize
    ) => {
      if (!searchKeyword.trim()) {
        setProducts([]);
        setTotalPages(0);
        setTotal(0);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const searchParams: SearchProductsRequest = {
          keyword: searchKeyword.trim(),
          currentPage: page,
          pageSize: size,
        };

        const response = await searchProducts(searchParams);

        if (isError(response)) {
          setError("Failed to search products");
          setProducts([]);
        } else {
          const searchData = response.data.data[0]; // Get first (and likely only) data item
          setProducts(searchData?.records || []);
          setTotalPages(searchData?.totalPage || 0);
          setTotal(searchData?.totalRecords || 0);
          setCurrentPage(page);
        }
      } catch (err) {
        setError("An error occurred while searching");
        console.error("Search error:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    },
    [pageSize]
  );

  // Handle Excel generation and download
  const handleExcelDownload = useCallback(async () => {
    if (!keyword.trim()) {
      setError("Please enter a keyword first");
      return;
    }

    setExcelLoading(true);
    setError(null);

    try {
      const params = {
        keyword: keyword.trim(),
        currentPage,
        pageSize,
      };

      await downloadProductsExcel(params);
    } catch (err) {
      setError("Failed to generate Excel file");
      console.error("Excel generation error:", err);
    } finally {
      setExcelLoading(false);
    }
  }, [keyword, currentPage, pageSize]);

  // Handle keyword change with debouncing
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  const handleKeywordChange = (value: string) => {
    setKeyword(value);
    setCurrentPage(1); // Reset to first page on new search

    // Clear existing timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Set new timer
    const newTimer = setTimeout(() => {
      handleSearch(value, 1, pageSize);
    }, 1000);

    setDebounceTimer(newTimer);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      handleSearch(keyword, page, pageSize);
    }
  };

  // Handle page size change
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
    if (keyword.trim()) {
      handleSearch(keyword, 1, size);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Controls */}
      <div className="bg-white p-6 rounded-lg shadow-sm border-blue-100 border">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          {/* Search Input */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Введите данные продукта
            </label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => handleKeywordChange(e.target.value)}
              placeholder="Enter product keyword (e.g., microwave)"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Page Size Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Размер стр.
            </label>
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          {/* Excel Export Button */}
          <button
            onClick={handleExcelDownload}
            disabled={excelLoading || !keyword.trim()}
            className="bg-green-600 hover:bg-green-800 disabled:bg-gray-300 text-white px-4 py-2 rounded-md font-medium transition-colors"
          >
            {excelLoading ? "Generating..." : "Export Excel"}
          </button>
        </div>

        {/* Search Stats */}
        {total > 0 && (
          <div className="mt-4 text-sm text-gray-600">
            Found {total} products for &ldquo;{keyword}&rdquo;
            {totalPages > 1 && (
              <span>
                {" "}
                - Page {currentPage} of {totalPages}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">Ищем продукты...</span>
        </div>
      )}

      {/* Products Grid */}
      {!loading && products.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.productId}
              className="bg-white border rounded-lg shadow-sm hover:shadow-md transition p-4"
            >
              {/* Product Image */}
              {product.mainImageUrl && (
                <div className="mb-3 relative h-40 w-full">
                  <Image
                    src={product.mainImageUrl}
                    alt={product.title}
                    fill
                    className="object-cover rounded"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              )}

              {/* Product Info */}
              <div>
                <h3 className="font-medium text-gray-900 line-clamp-2 mb-2">
                  {product.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                  {product.titleCn}
                </p>

                {/* Price and Stats */}
                <div className="mb-2">
                  <div className="text-lg font-bold text-red-600">
                    ¥{product.price}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    <span>⭐ {product.tradeScore}</span>
                    <span>📦 {product.monthSold} sold</span>
                    <span>🔄 {product.repurchaseRate}</span>
                  </div>
                </div>

                <div className="text-xs text-gray-500 space-y-1">
                  <div>ID: {product.productId}</div>
                  <div>
                    Categories: {product.firstCategoryId}/
                    {product.secondCategoryId}/{product.thirdCategoryId}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && keyword && products.length === 0 && !error && (
        <div className="text-center py-12 text-gray-500">
          <div className="text-lg mb-2">Не найдено</div>
          <div className="text-sm">
            Попробуйте совершить поиск с другим ключевым словом
          </div>
        </div>
      )}

      {/* Initial State */}
      {!keyword && !loading && (
        <div className="text-center py-12 text-gray-500">
          <div className="text-lg mb-2">Поиск продуктов</div>
          <div className="text-sm">Введите данные продукта для поиска</div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>

          <span className="px-3 py-2 text-sm text-gray-700">
            {currentPage} / {totalPages}
          </span>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
            className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
