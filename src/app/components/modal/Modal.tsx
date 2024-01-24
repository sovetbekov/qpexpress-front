'use client'

import React, { useCallback, useMemo } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion, Variants } from 'framer-motion'
import { useAppDispatch, useAppSelector } from '@/hooks/client/redux'
import { closeModal, selectModalData, selectModalType } from '@/redux/reducers/modalSlice'
import CalculatorModal from '@/app/components/modal/CalculatorModal'
import DenialReasonModal from '@/app/components/modal/DenialReasonModal'
import PaymentMethodModal from '@/app/components/modal/PaymentMethodModal'

type Props = {
    width: string,
    children: React.ReactNode,
    type: string,
    onClose?: () => void,
}

type ModalProps = {
    language: string
}

export default function Modal({language}: ModalProps) {
    const modalType = useAppSelector(selectModalType)
    const data = useAppSelector(selectModalData)


    const modalWidth = useMemo(() => {
        if (modalType === 'calculator') {
            return '30rem'
        } else if (modalType === 'denialReason') {
            return '40rem'
        } else if (modalType === 'paymentMethod') {
            return '25rem'
        } else {
            return '0'
        }
    }, [modalType])

    return (
        <AnimatePresence>
            {
                modalType && <ModalWrapper width={modalWidth} type={modalType}>
                    {
                        modalType === 'calculator' &&
                        <CalculatorModal/>
                    }
                    {
                        modalType === 'denialReason' &&
                        <DenialReasonModal recipient={data} language={language}/>
                    }
                    {
                        modalType === 'paymentMethod' &&
                        <PaymentMethodModal/>
                    }
                </ModalWrapper>
            }
        </AnimatePresence>
    )
}

const modalVariants: Variants = {
    initial: {
        opacity: 0,
        y: -100,
    },
    animate: {
        opacity: 1,
        y: 0,
    },
    exit: {
        opacity: 0,
        y: 100,
    },
}

function ModalWrapper({width, onClose, type, children}: Readonly<Props>) {
    const dispatch = useAppDispatch()
    const onCloseClick = useCallback(() => {
        dispatch(closeModal())
        onClose?.()
    }, [dispatch, onClose])

    return (
        <motion.div
            key={'background'}
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            className={'md:w-full md:h-full md:bg-black/50 md:flex md:fixed md:justify-center md:items-center md:z-10 md:left-0 md:top-0'}
            onClick={onCloseClick}>
            <motion.div
                layout
                key={'modal'}
                variants={modalVariants}
                initial={'initial'}
                animate={'animate'}
                exit={'exit'}
                transition={{
                    type: 'spring',
                    duration: .5,
                }}
                style={{width: width}}
                className={'md:absolute md:min-h-[20rem] md:bg-gray md:shadow md:rounded-[2rem] md:border-none'}
                onClick={event => event.stopPropagation()}>
                <motion.div layout key={type}>
                    <button
                        className={'md:absolute md:cursor-pointer md:bg-none md:text-2xl md:transition-[color] md:duration-[0.2s] md:ease-[ease-in-out] md:border-[none] md:right-8 md:top-8 md:hover:text-black'}
                        onClick={onCloseClick}>
                        <Image src={'/assets/cross.svg'} alt={'cross'} width={20} height={20}/>
                    </button>
                    {children}
                </motion.div>
            </motion.div>
        </motion.div>
    )
}