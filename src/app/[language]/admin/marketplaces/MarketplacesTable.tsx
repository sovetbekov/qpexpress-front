'use client'

import { useRouter } from 'next/navigation'
import { MarketplaceDataOverview } from '@/types/entities'

type Props = {
    marketplaces: MarketplaceDataOverview[],
}

export default function MarketplacesTable({ marketplaces }: Readonly<Props>) {
    const router = useRouter()
    
    const handleItemClick = (id: string) => {
        // Navigate to the marketplace detail page
        router.push(`/admin/marketplaces/${id}`)
    }

    return (
        <div className="container mx-auto p-4">
            <ul className="space-y-4">
                {marketplaces.map((marketplace) => (
                    <li 
                        key={marketplace.id} 
                        className="bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition-shadow duration-200 cursor-pointer p-4 md:p-6"
                        onClick={() => handleItemClick(marketplace.id)}
                    >
                        <div className="md:flex md:justify-between md:items-center">
                            <div>
                                    <div className="flex flex-row gap-1 md:gap-3 items-baseline">
                                        <a 
                                        href={marketplace.link} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="text-blue-500 hover:underline mb-2 md:mb-0 text-lg md:text-xl font-semibold mb-2"
                                        onClick={(e) => e.stopPropagation()}
                                        >
                                            {marketplace.brand}
                                        </a>
                                        <p className="text-sm md:text-base text-gray-300">{marketplace.country}</p>
                                    </div>
                                  
                                <p className="text-sm md:text-base text-gray-600 mt-1 mb-3">{marketplace.category}</p>

                                <p className="text-sm md:text-base text-gray-700 mb-4">{marketplace.description}</p>
                            </div>
                            <div className="flex flex-col items-start md:items-end">
                                
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}
