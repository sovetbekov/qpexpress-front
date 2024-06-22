'use client'

import React, { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { DeliveryStatus } from '@/types/utils'
import { DeliveryData, GoodData } from '@/types/entities'
import { getPaymentStatus } from '@/services/payment'
import { useTranslation } from '@/app/i18n/client'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material'

type Props = {
    delivery: DeliveryData
    language: string
}

function getAmountOfStick(status: DeliveryStatus): number {
    switch (status) {
        case 'CREATED':
            return 1
        case 'IN_THE_WAY':
            return 2
        case 'IN_YOUR_COUNTRY':
            return 3
        case 'IN_MAIL_OFFICE':
            return 4
        case 'DELIVERED':
            return 5
        default:
            return 0
    }
}

export const dynamic = 'force-dynamic'

const DeliveryCard: React.FC<Props> = ({ delivery, language }: Readonly<Props>) => {
    const { t } = useTranslation(language, 'delivery')

    const statusNames = useMemo(() => ({
        CREATED: t('created'),
        DELIVERED_TO_WAREHOUSE: t('delivered_to_warehouse'),
        IN_THE_WAY: t('in_the_way'),
        IN_YOUR_COUNTRY: t('in_your_country'),
        IN_MAIL_OFFICE: t('in_mail_office'),
        DELIVERED: t('delivered'),
        DELETED: t('deleted'),
    }), [t])

    const amountOfSticks = useMemo(() => getAmountOfStick(delivery.status), [delivery.status])

    const [isPaidLoading, setIsPaidLoading] = useState(true)
    const [isPaid, setIsPaid] = useState(false)

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedGoods, setSelectedGoods] = useState<GoodData[]>([])

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const paymentStatus = await getPaymentStatus({ deliveryId: delivery.id })
                if (paymentStatus.status === 'error') {
                    console.error(paymentStatus.error)
                } else if (paymentStatus.data === 'Processed') {
                    setIsPaid(true)
                }
            } catch (error) {
                console.error(error)
            } finally {
                setIsPaidLoading(false)
            }
        }

        fetchStatus()
    }, [delivery.id])

    const openModal = () => {
        setSelectedGoods(delivery.goods)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
    }

    return (
        <div className="bg-gray rounded-3xl p-5 md:p-8">
            <h2 className="text-xl">{delivery.deliveryNumber}</h2>
            <p className="text-base">{t('delivery_status')}: {statusNames[delivery.status]}</p>
            <div className="flex flex-row gap-2 md:gap-5 mt-2 mb-2">
                {Array.from({ length: amountOfSticks }).map((_, index) => (
                    <div key={index} className="w-1/6 h-1.5 md:h-2 bg-blue rounded-full" />
                ))}
                {Array.from({ length: 6 - amountOfSticks }).map((_, index) => (
                    <div key={index} className="w-1/6 h-1.5 md:h-2 bg-dark-gray rounded-full" />
                ))}
            </div>
            {delivery.status === 'IN_THE_WAY' && !isPaidLoading && !isPaid && (
                <Link href={`/profile/deliveries/payment/${delivery.id}`}>
                    <button className="bg-blue mt-5 rounded-full w-full md:px-12 py-3 text-white md:mt-5">
                        {t('pay')}
                    </button>
                </Link>
            )}
            <button onClick={openModal} className="bg-qp-orange mt-5 rounded-full w-full md:px-12 py-3 text-white md:mt-5">
                {t('open')}
            </button>
            <Dialog open={isModalOpen} onClose={closeModal} fullWidth maxWidth="sm" PaperProps={{ style: { borderRadius: 13 } }}>
                <DialogTitle>{t('goods_details')}</DialogTitle>
                <DialogContent dividers>
                    {selectedGoods.map(good => (
                        <Box key={good.id} mb={2} p={2} border={1} borderColor="grey.300" borderRadius={2}>
                            <div className="">
                                <Typography variant="h6">{good.name}</Typography>
                                <Typography variant="body2" color="textSecondary">{good.description}</Typography>
                            </div>
                            
                            <Typography variant="body2" color="textPrimary" mt={2}>{t('price')}: {good.price} {good.currency.code?.toUpperCase()!}</Typography>
                            <Typography variant="body2" mt={1}>
                                <a href={good.link} target="_blank" rel="noopener noreferrer" className='text-qp-blue text-md'>{t('view_more')}</a>
                            </Typography>
                        </Box>
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeModal} color="primary">
                        {t('close')}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default DeliveryCard
