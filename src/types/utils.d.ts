export type OrderStatus = 'CREATED' | 'DELIVERED_TO_WAREHOUSE' | 'IN_THE_WAY' | 'IN_YOUR_COUNTRY' | 'IN_MAIL_OFFICE' | 'DELIVERED' | 'DELETED'

export type DeliveryStatus = 'CREATED' | 'IN_THE_WAY' | 'IN_YOUR_COUNTRY' | 'IN_MAIL_OFFICE' | 'DELIVERED' | 'DELETED'

export type RecipientStatus = 'ACTIVE' | 'INACTIVE' | 'DELETED' | 'PENDING'

export type ValidatorProps = {
    validate: boolean
    message: string
}