import * as React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

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
    return (
        <>
            {children &&
                <motion.li
                    variants={variants}
                    onClick={onClick}
                    className={'p-5 border-b border-b-light-gray'}
                >
                    {children}
                </motion.li>
            }
            {
                link &&
                <Link href={link}>
                    <motion.li
                        variants={variants}
                        onClick={onClick}
                        className={'p-5 border-b border-b-light-gray'}
                    >{text}
                    </motion.li>
                </Link>
            }
        </>
    )
}
