import { animated, useSpring } from '@react-spring/web'
import * as React from 'react'
import { useEffect } from 'react'

type MenuProps = {
    toggle: () => void;
    isOpen: boolean;
}
export const MenuToggle = ({isOpen, toggle}: MenuProps) => {
    const [topPath, topPathApi] = useSpring(() => ({
        d: "M 2 2.5 L 20 2.5"
    }))
    const [middlePath, middlePathApi] = useSpring(() => ({
        from: { opacity: 1 },
    }))
    const [bottomPath, bottomPathApi] = useSpring(() => ({
        from: { d: "M 2 16.346 L 20 16.346" },
        to: { d: "M 3 2.5 L 17 16.346" }
    }))
    useEffect(() => {
        if (isOpen) {
            topPathApi.start({
                d: "M 3 16.5 L 17 2.5"
            })
            middlePathApi.start({
                opacity: 0
            })
            bottomPathApi.start({
                d: "M 3 2.5 L 17 16.346"
            })
        } else {
            topPathApi.start({
                d: "M 2 2.5 L 20 2.5"
            })
            middlePathApi.start({
                opacity: 1
            })
            bottomPathApi.start({
                d: "M 2 16.346 L 20 16.346"
            })
        }
    })
    return (
        <button onClick={toggle} className={'flex items-center justify-center z-30'}>
            <animated.svg width="23" height="23" viewBox="0 0 23 23">
                <animated.path d={topPath.d} stroke="black"/>
                <animated.path style={middlePath} d="M 2 9.423 L 20 9.423" stroke="black"/>
                <animated.path d={bottomPath.d} stroke="black"/>
            </animated.svg>
        </button>
    )
}
