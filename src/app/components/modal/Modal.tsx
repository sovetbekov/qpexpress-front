'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/client/redux'
import { closeModal, selectModals } from '@/redux/reducers/modalSlice'
import { ModalState } from '@/redux/types'

import CalculatorModal from '@/app/components/modal/CalculatorModal'
import DenialReasonModal from '@/app/components/modal/DenialReasonModal'
import PaymentMethodModal from '@/app/components/modal/PaymentMethodModal'
import KaspiQrModal from '@/app/components/modal/KaspiQrModal'
import { animated, SpringValue, useChain, useSpring, useSpringRef, useTransition } from '@react-spring/web'

type WrapperProps = {
    size: { width: string, height: string }
    children: React.ReactNode
    style: { y: SpringValue<number>, opacity: SpringValue<number> }
    type: string
}

type Props = {
    language: string
}

const AnimatedModalWrapper = animated(ModalWrapper)

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
        case 'kaspiQr':
            return {
                width: '30rem',
                height: '40rem',
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
    const modalTransition = useTransition(modals[0], {
        from: {opacity: 0, y: -100},
        enter: {opacity: 1, y: 0},
        leave: {opacity: 0, y: 100},
        keys: modals.length > 0 ? 1 : 0,
    })

    const dispatch = useAppDispatch()

    const backgroundTransition = useTransition(modals.length > 0, {
        from: {opacity: 0},
        enter: {opacity: 1},
        leave: {opacity: 0},
    })

    const onClose = useCallback(() => {
        if (modals.length === 0) return
        dispatch(closeModal({id: modals[0].id}))
    }, [dispatch, modals])

    return (
        <>
            {
                backgroundTransition((backgroundStyle, show) =>
                        show && (
                            <animated.div
                                className={'bg-black/50 fixed left-0 top-0 right-0 bottom-0 z-50'}
                                style={backgroundStyle}
                                onClick={onClose}
                            >
                                {
                                    modalTransition((modalStyle, modal) => (
                                        <AnimatedModalWrapper style={modalStyle}
                                                              size={getModalDimensions(modal.modalType)}
                                                              type={modal.modalType}>
                                            {modals[0]?.modalType === 'calculator' &&
                                                <CalculatorModal language={language}/>}
                                            {modals[0]?.modalType === 'denialReason' &&
                                                <DenialReasonModal recipient={modals[0].data.recipient}
                                                                   language={language}/>}
                                            {modals[0]?.modalType === 'paymentMethod' &&
                                                <PaymentMethodModal price={modals[0].data.price} deliveryId={modals[0].data.deliveryId}/>}
                                            {modals[0]?.modalType === 'kaspiQr' &&
                                                <KaspiQrModal price={modals[0].data.price} deliveryId={modals[0].data.deliveryId}/>}
                                        </AnimatedModalWrapper>
                                    ))
                                }
                            </animated.div>
                        ),
                )
            }
        </>
    )
}

function ModalWrapper({size, style, type, children}: Readonly<WrapperProps>) {
    // Create a spring for the content opacity
    const contentOpacityRef = useSpringRef()
    const [contentOpacity, contentOpacityApi] = useSpring(() => ({
        ref: contentOpacityRef,
        opacity: 1,
    }))

    // Create a spring for the modal dimensions
    const dimensionRef = useSpringRef()
    const dimension = useSpring({
        ref: dimensionRef,
        width: size.width,
        height: size.height,
        config: {tension: 200, friction: 20},
    })
    // Store the previous type and children in state
    const [prevType, setPrevType] = useState(type)
    const [prevChildren, setPrevChildren] = useState(children)

    // Update the previous type and children when the type changes
    useEffect(() => {
        if (prevType === type) {
            setPrevChildren(children)
            return
        }
        contentOpacityApi.start({opacity: 0})
        setTimeout(() => {
            setPrevType(type)
            setPrevChildren(children)
            contentOpacityApi.start({opacity: 1})
        }, 300)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [children, contentOpacityApi, prevType, type])

    useChain([contentOpacityRef, dimensionRef, contentOpacityRef], [0, 0.3, 0.6])

    return (
        <div className={'flex w-full h-full justify-center items-center'}>
            <animated.div style={{...dimension, ...style}}
                          className={'absolute h-full w-full shadow rounded-xl border-none z-20 bg-white'}
                          onClick={e => e.stopPropagation()}>
                <animated.div style={contentOpacity}>
                    {prevChildren}
                </animated.div>
            </animated.div>
        </div>
    )
}