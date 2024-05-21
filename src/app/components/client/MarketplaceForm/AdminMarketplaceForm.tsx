import React from 'react';
import { MarketplaceDataOverview } from '@/types';
import UpdateMarketplaceForm from '@/app/components/client/MarketplaceForm/UpdateMarketplaceForm';
import CreateMarketplaceForm from '@/app/components/client/MarketplaceForm/CreateMarketplaceForm';

type Props = {
    language: string;
} & ({
    isUpdate: true;
    data: MarketplaceDataOverview;
} | {
    isUpdate: false;
});

export default function AdminMarketplaceForm({ language, ...props }: Readonly<Props>) {
    return (
        <div className="flex flex-col p-5 gap-y-5 md:gap-y-[8rem]">
            <h2 className="text-2xl md:hidden">Добавить маркетплейссс</h2>
            {props.isUpdate ? (
                <UpdateMarketplaceForm data={props.data} language={language} />
            ) : (
                <CreateMarketplaceForm language={language} />
            )}
        </div>
    );
}
