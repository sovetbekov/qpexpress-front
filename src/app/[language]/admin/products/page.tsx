import React from 'react'
import { getProducts } from '@/services/products'
import { isError } from '@/app/lib/utils'
import ProductsList from './components/ProductsList'

type Props = {
    params: {
        language: string
    }
}

export const dynamic = 'force-dynamic'

export default async function Page({ params: { language } }: Readonly<Props>) {
    const productsResponse = await getProducts({ language, pageSize: 20 });
    
    if (isError(productsResponse)) {
        return (
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">Products</h1>
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    Error loading products
                </div>
            </div>
        );
    }
    
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Products</h1>
            <ProductsList initialProducts={productsResponse.data} language={language} />
        </div>
    );
}