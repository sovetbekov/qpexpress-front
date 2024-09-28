import React from 'react'
import Description from '@/app/components/home/Description'
import AboutUs from '@/app/components/home/AboutUs'
import HowItWorks from '@/app/components/home/HowItWorks'
import Calculator from '@/app/components/home/Calculator'
import LeaveContacts from '@/app/components/home/LeaveContacts'

type Props = {
    params: {
        language: string,
    }
}

export default function Page({params: {language}}: Readonly<Props>) {
    return (
        <div className={'flex flex-col gap-y-10'}>
            <Description language={language}/>
            <AboutUs language={language}/>
            <HowItWorks language={language}/>
            <Calculator language={language}/>
            <LeaveContacts language={language}/>
        </div>
    )
}
