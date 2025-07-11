"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  getProductDetails,
  ProductDetails as ProductDetailsType,
} from "@/services/products";
import { isError } from "@/app/lib/utils";

interface ProductDetailsProps {
  productId: string;
  language: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductDetails({
  productId,
  language,
  isOpen,
  onClose,
}: ProductDetailsProps) {
  const [productDetails, setProductDetails] =
    useState<ProductDetailsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const fetchDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getProductDetails(productId, language);
        console.log("Product details response:", response);

        if (isError(response)) {
          const errorMessage =
            typeof response.error === "object"
              ? JSON.stringify(response.error)
              : String(response.error);
          setError(errorMessage);
        } else {
          // Store the full response with nested data structure
          setProductDetails(response.data);
        }
      } catch (err) {
        setError("Failed to fetch product details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [productId, language, isOpen]);

  if (!isOpen) return null;

  // Get the actual product details from the nested structure
  const product = productDetails?.data?.[0];
  console.log("Product details:", product);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Product Details</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <span className="text-2xl">&times;</span>
            </button>
          </div>

          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {!loading && !error && product && (
            <div>
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">
                  {product.title}
                </h3>
                <p className="text-gray-600">{product.titleCn}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Product ID: {product.productId}
                </p>
                <p className="text-sm text-gray-500">
                  Category ID: {product.categoryId}
                </p>
              </div>

              {/* Product Images */}

              {product.images && product.images.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium mb-2">Images</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {product.images.map((imgUrl, index) => (
                      <div
                        key={index}
                        className="relative h-40 border rounded overflow-hidden"
                      >
                        <Image
                          src={imgUrl}
                          alt={`Product image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Video if available */}
              {product.mainVideo && (
                <div className="mb-6">
                  <h4 className="font-medium mb-2">Video</h4>
                  <video 
                    controls 
                    className="w-full max-h-80 object-contain"
                    src={product.mainVideo}
                  ></video>
                </div>
              )}

              {/* Attributes */}
              {product.attributes && product.attributes.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium mb-2">Attributes</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2">
                    {product.attributes.map((attr, index) => (
                      <div key={index} className="flex">
                        <span className="font-medium text-gray-700 mr-2">
                          {attr.attrName}:
                        </span>
                        <span className="text-gray-600">{attr.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="mt-6">
                <h4 className="font-medium mb-2">Description</h4>
                <div
                  className="prose max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{
                    __html: product.description,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}