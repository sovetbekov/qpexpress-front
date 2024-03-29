import React from 'react'

export const dynamic = 'force-dynamic'

type Props = {
    params: {
        language: string
    }
}

export default function Page({params: {language}}: Readonly<Props>) {
    if (language === 'ru') {
        return (
            <div className={'p-20'}>
                <p className={'text-base'}>Компания: ТОО «QP Express»</p>
                <p className={'text-base'}>ИИН/БИН: 230840030304</p>
                <p className={'text-base'}>ИИК: KZ04601A861020296981</p>
                <p className={'text-base'}>КБЕ: 17</p>
                <p className={'text-base'}>Банк: АО «Народный Банк Казахстана»</p>
                <p className={'text-base'}>БИК: HSBKKZKX</p>
                <p className={'text-base'}>Юридический адрес: 050008, Казахстан, г. Алматы, Алмалинский район, ул.
                    Карасай
                    батыра, д. 180, кв. 76</p>
                <p className={'text-base'}>Почтовый адрес: 050008, Казахстан, г. Алматы, Алмалинский район, ул. Карасай
                    батыра, д. 180, кв. 76</p>
            </div>
        )
    } else {
        return (
            <div className={'p-20'}>
                <p className={'text-base'}>Company: LLP «QP Express»</p>
                <p className={'text-base'}>BIN: 230840030304</p>
                <p className={'text-base'}>IBAN: KZ04601A861020296981</p>
                <p className={'text-base'}>KBE: 17</p>
                <p className={'text-base'}>Bank: JSC «Narodny Bank Kazakhstan»</p>
                <p className={'text-base'}>BIC: HSBKKZKX</p>
                <p className={'text-base'}>Legal address: 050008, Kazakhstan, Almaty, Almalinsky district, Karasay
                    batyra
                    street, 180, apt. 76</p>
                <p className={'text-base'}>Mailing address: 050008, Kazakhstan, Almaty, Almalinsky district, Karasay
                    batyra
                    street, 180, apt. 76</p>
            </div>
        )
    }
}