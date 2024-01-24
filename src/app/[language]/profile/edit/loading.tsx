import React from 'react'
import PageWrapper from '@/app/[language]/profile/PageWrapper'

export default function Loading() {
    return (
        <PageWrapper>
            <div className={'flex flex-col gap-y-4 md:gap-y-12 px-5 animate-pulse'}>
                <div className={'flex flex-col gap-y-4 md:gap-y-10'}>
                    <div className={'flex flex-col gap-y-4 md:flex-row md:gap-y-5 md:gap-x-6 md:flex-wrap w-full'}>
                        <div className={'md:w-[calc(50%-0.75rem)] w-full h-16 bg-gray rounded-full'}></div>
                        <div className={'md:w-[calc(50%-0.75rem)] w-full h-16 bg-gray rounded-full'}></div>
                        <div className={'md:w-[calc(50%-0.75rem)] w-full h-16 bg-gray rounded-full'}></div>
                        <div className={'md:w-[calc(50%-0.75rem)] w-full h-16 bg-gray rounded-full'}></div>
                    </div>
                    <div
                        className={'rounded-full md:w-[20rem] w-full h-16 bg-gray'}></div>
                </div>
                <div className={'flex flex-col gap-y-4 md:gap-y-10'}>
                    <div className={'h-8 w-full md:w-44 bg-gray rounded-full'}></div>
                    <div className={'flex flex-row gap-5'}>
                        <div className={'h-[25px] w-[25px] rounded-full bg-gray'}></div>
                        <div className={'h-5 w-1/3 bg-gray rounded-full'}></div>
                    </div>
                    <div className={'flex flex-col gap-y-4 md:flex-row md:gap-y-5 md:gap-x-6 md:flex-wrap'}>
                        <div className={'md:w-[calc(50%-0.75rem)] w-full h-16 bg-gray rounded-full'}></div>
                        <div className={'md:w-[calc(50%-0.75rem)] w-full h-16 bg-gray rounded-full'}></div>
                        <div className={'md:w-[calc(50%-0.75rem)] w-full h-16 bg-gray rounded-full'}></div>
                        <div className={'md:w-[calc(50%-0.75rem)] w-full h-16 bg-gray rounded-full'}></div>
                        <div className={'md:w-[calc(50%-0.75rem)] w-full h-16 bg-gray rounded-full'}></div>
                        <div className={'md:w-[calc(50%-0.75rem)] w-full h-16 bg-gray rounded-full'}></div>
                        <div className={'w-full'}>
                            <div className={'md:w-1/2 text-base px-5 h-10 md:p-0 bg-gray rounded-full'}></div>
                        </div>
                        <div className={'md:w-[calc(50%-0.75rem)] w-full h-16 bg-gray rounded-full'}></div>
                        <div className={'md:w-[calc(50%-0.75rem)] w-full h-16 bg-gray rounded-full'}></div>
                        <div className={'md:w-[calc(50%-0.75rem)] w-full h-16 bg-gray rounded-full'}></div>
                    </div>
                    <div className={'bg-gray p-3 w-full md:py-5 rounded-full md:w-[20rem]'}></div>
                </div>
            </div>
        </PageWrapper>
    )
}