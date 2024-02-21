'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/client/redux'
import { closeModal, selectModals } from '@/redux/reducers/modalSlice'
import { ModalState } from '@/redux/types'
import { AnimatePresence, motion } from 'framer-motion'
import CalculatorModal from '@/app/components/modal/CalculatorModal'
import DenialReasonModal from '@/app/components/modal/DenialReasonModal'
import PaymentMethodModal from '@/app/components/modal/PaymentMethodModal'

type WrapperProps = {
    size: { width: string, height: string }
    children: React.ReactNode
    type: string
}

type Props = {
    language: string
}

const MotionModalWrapper = motion(ModalWrapper)

function getModalDimensions(modalType: ModalState['modalType']) {
    switch (modalType) {
        case 'calculator':
            return {
                width: '30rem',
                height: '28rem',
            }
        case 'denialReason':
            return {
                width: '40rem',
                height: '40rem',
            }
        case 'paymentMethod':
            return {
                width: '25rem',
                height: '25rem',
            }
        default:
            return {
                width: '0',
                height: '0',
            }
    }
}

export default function Modal({language}: Readonly<Props>) {
    const modals = useAppSelector(selectModals)

    const dispatch = useAppDispatch()

    const modalVariants = {
        hidden: {
            opacity: 0,
            y: -100,
        },
        visible: {
            opacity: 1,
            y: 0,
        },
        exit: {
            opacity: 0,
            y: 100,
        },
    }

    const backgroundVariants = {
        hidden: {
            opacity: 0,
        },
        visible: {
            opacity: 1,
        },
        exit: {
            opacity: 0,
        },
    }

    const onClose = useCallback(() => {
        if (modals.length === 0) return
        dispatch(closeModal({id: modals[0].id}))
    }, [dispatch, modals])

    return (
        <AnimatePresence>
            {
                modals.length > 0 &&
                <motion.div className={'bg-black/50 fixed left-0 top-0 right-0 bottom-0'}
                            variants={backgroundVariants} initial={'hidden'} animate={'visible'} exit={'exit'}
                            onClick={onClose}>
                    {
                        !!modals[0] &&
                        <MotionModalWrapper size={getModalDimensions(modals[0].modalType)} type={modals[0].modalType}
                                            variants={modalVariants} initial={'hidden'} animate={'visible'}
                                            exit={'exit'}>
                            {modals[0].modalType === 'calculator' && <CalculatorModal language={language}/>}
                            {modals[0].modalType === 'denialReason' && <DenialReasonModal recipient={modals[0].data.recipient} language={language}/>}
                            {modals[0].modalType === 'paymentMethod' && <PaymentMethodModal/>}
                        </MotionModalWrapper>
                    }
                </motion.div>
            }
        </AnimatePresence>
    )
}

function ModalWrapper({size, type, children}: Readonly<WrapperProps>) {
    const [prevType, setPrevType] = useState(type)
    const [prevChildren, setPrevChildren] = useState(children)
    const contentVariants = {
        hidden: {
            opacity: 0,
        },
        visible: {
            opacity: 1,
        },
        exit: {
            opacity: 0,
        },
    }

    useEffect(() => {
        if (prevType === type) {
            setPrevChildren(children)
            return
        }
        setTimeout(() => {
            setPrevType(type)
            setPrevChildren(children)
        }, 300)
    }, [children, prevType, type])

    return (
        <div className={'flex w-full h-full justify-center items-center'}>
            <motion.div
                style={{
                    width: size.width,
                    height: size.height,
                }}
                className={'absolute min-h-[20rem] shadow rounded-xl border-none z-20 bg-white'}
                onClick={e => e.stopPropagation()}
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                <div key={type}>
                    {prevChildren}
                </div>
            </motion.div>
        </div>
    )
}