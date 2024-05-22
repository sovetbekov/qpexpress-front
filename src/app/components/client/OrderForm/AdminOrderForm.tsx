import React from 'react';
import ReadOnlyOrderForm from '@/app/components/client/OrderForm/ReadOnlyOrderForm';
import UpdateOrderForm from '@/app/components/client/OrderForm/UpdateOrderForm';
import { OrderData } from '@/types/entities';
import { OrderFormData } from '@/types/forms';

import { useTranslation } from '@/app/i18n';
import { Money } from '@/app/components/input/MoneyInput';

type Props = {
    order: OrderData;
    language: string;
};

export default async function AdminOrderForm({ order, language }: Readonly<Props>) {
    const { t } = await useTranslation(language, 'order');
    
    const transformedOrder: OrderFormData = {
        recipient: order.recipient,
        goods: order.goods.map(good => ({
            id: good.id,
            country: good.country,
            customOrderId: good.deliveryId,
            trackingNumber: good.trackingNumber,
            link: good.link,
            name: good.name,
            price: { value: good.price, currency: good.currency } as Money, 
            description: good.description,
            originalBox: good.originalBox,
        })),
    };

    const FormComponent = order.status === 'IN_THE_WAY' || order.status === 'CREATED' 
        ? UpdateOrderForm 
        : ReadOnlyOrderForm;

    return (
        <div className="flex flex-col p-5 gap-y-5 md:gap-y-[8rem]">
            <h2 className="text-2xl md:hidden">{t('add_order')}</h2>
            <FormComponent data={transformedOrder} language={language} orderId={order.id} />
        </div>
    );
}
