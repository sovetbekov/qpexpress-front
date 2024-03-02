import * as React from 'react'
import Link from 'next/link'
import { useSpring } from '@react-spring/web'

type MenuItemProps = {
    text?: string,
    link?: string,
    children?: React.ReactNode,
    onClick: () => void,
}

const variants = {
    open: {
        y: 0,
        opacity: 1,
        transition: {
            y: {stiffness: 1000, velocity: -100},
        },
    },
    closed: {
        y: 50,
        opacity: 0,
        transition: {
            y: {stiffness: 1000},
        },
    },
}

export const MenuItem = ({text, link, onClick, children}: MenuItemProps) => {
    const animation = useSpring({
        y: 0,
        opacity: 1,
    })

    return (
        <>
            {children &&
                <li onClick={onClick}
                    className={'p-5 border-b border-b-light-gray'}>
                    {children}
                </li>
            }
            {
                link &&
                <Link href={link}>
                    <li onClick={onClick}
                        className={'p-5 border-b border-b-light-gray'}>
                        {text}
                    </li>
                </Link>
            }
        </>
    )
}
