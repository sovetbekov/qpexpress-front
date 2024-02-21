import React from 'react'
import Image from 'next/image'
import { useAppDispatch } from '@/hooks/client/redux'
import { closeModal } from '@/redux/reducers/modalSlice'

type Props = {
    children: React.ReactNode
}

export default function ModalHeader({children}: Readonly<Props>) {
    const dispatch = useAppDispatch()

    const onCloseClick = () => {
        dispatch(closeModal())
    }

    return (
        <div className={'h-14 w-full flex flex-row items-center'}>
            {children}
            <button
                type={'button'}
                className={'absolute cursor-pointer bg-none right-5 top-5'}
                onClick={onCloseClick}>
                <Image src={'/assets/cross.svg'} alt={'cross'} width={0} height={0} className={'w-4 h-auto'}/>
            </button>
        </div>
    )
}