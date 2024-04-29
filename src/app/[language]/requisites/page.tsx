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
                <p className={'text-base'}>Юридический адрес: 050054, Казахстан, Алматы, Турксибский район, ул. Гете, 263</p>
                <p className={'text-base'}>Почтовый адрес: 050054, Казахстан, Алматы, Турксибский район, ул. Гете, 263</p>
            </div>
        )
    } else if (language === 'kz') {
        return (
            <div className={'p-20'}>
                <p className={'text-base'}>Компания: &ldquo;QP Express&rdquo; ЖШС</p>
                <p className={'text-base'}>ЖСН/БСН: 230840030304</p>
                <p className={'text-base'}>ЖСК: KZ04601A861020296981</p>
                <p className={'text-base'}>КБЕ: 17</p>
                <p className={'text-base'}>Банк: &ldquo;Қазақстан Халық Банкі&rdquo;АҚ</p>
                <p className={'text-base'}>БИК: HSBKKZKX</p>
                <p className={'text-base'}>Заңды мекенжайы: Қазақстан, Алматы, Түрксіб ауданы, Гете көш-сі, 263,  050054</p>
                <p className={'text-base'}>Пошталық мекенжайы: Қазақстан, Алматы, Түрксіб ауданы, Гете көш-сі, 263,  050054</p>
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
                <p className={'text-base'}>Legal address: Kazakhstan, Almaty, Turksib district, Goethe st., 263, 050054 </p>
                <p className={'text-base'}>Mailing address: Kazakhstan, Almaty, Turksib district, Goethe st., 263, 050054</p>
            </div>
        )
    }
}