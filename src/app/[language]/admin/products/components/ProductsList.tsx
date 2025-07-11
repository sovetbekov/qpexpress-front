'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { ProductItem } from '@/services/products'
import ProductDetails from './ProductDetails';

interface ProductsListProps {
    initialProducts: ProductItem[] | any; // Allow for flexibility in the input type
    language: string;
}

export default function ProductsList({ initialProducts, language }: ProductsListProps) {
    // Ensure we have a valid array to work with
    const [products, setProducts] = useState<ProductItem[]>([]);
    
    // Handle array extraction on component mount
    useEffect(() => {
        if (Array.isArray(initialProducts)) {
            setProducts(initialProducts);
        } else if (initialProducts && Array.isArray(initialProducts.data)) {
            // Handle case where API might return {data: [...]}
            setProducts(initialProducts.data);
        } else {
            console.error('Invalid products data:', initialProducts);
            setProducts([]);
        }
    }, [initialProducts]);
    
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    
    const handleProductClick = (productId: string) => {
        setSelectedProductId(productId);
        setIsDetailsModalOpen(true);
    };
    
    const handleCloseModal = () => {
        setIsDetailsModalOpen(false);
    };
    
    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.length === 0 ? (
                    <div className="col-span-3 py-8 text-center text-gray-500">
                        No products available
                    </div>
                ) : (
                    products.map((product) => (
                        <div 
                            key={product.productId}
                            className="border rounded-lg shadow-sm hover:shadow-md transition cursor-pointer p-4"
                            onClick={() => handleProductClick(product.productId)}
                        >
                            <div className="text-lg font-medium">{product.productId}</div>
                            <div className="text-gray-600 mt-2">
                                Pool Total: {product.poolTotal}
                            </div>
                            <div className="mt-4 text-blue-600 hover:underline text-sm">
                                Click for details
                            </div>
                        </div>
                    ))
                )}
            </div>
            
            {isDetailsModalOpen && selectedProductId && (
                <ProductDetails 
                    productId={selectedProductId} 
                    language={language} 
                    isOpen={isDetailsModalOpen}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
}