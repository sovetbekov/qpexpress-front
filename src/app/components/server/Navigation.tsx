'use client'

import React, { useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAppDispatch } from '@/hooks/client/redux'
import { openModal } from '@/redux/reducers/modalSlice'
import { MenuToggle } from '@/app/components/client/MenuToggle'
import { MenuItem } from '@/app/components/client/MenuItem'
import { useAuthenticationActions } from '@/hooks/client/useAuthenticationActions'
import { useTranslation } from '@/app/i18n/client'
import { CN, GB, RU } from 'country-flag-icons/react/3x2'
import OptionSelect from '@/app/components/input/DropdownInput/OptionSelect'
import { animated, useTransition } from '@react-spring/web'

type Props = {
    language: string
}

export default function Navigation({language}: Readonly<Props>) {
    const pathname = usePathname()
    const pathnameWithoutLanguage = pathname?.replace(/\/(ru|en|zh)/, '')
    const {t} = useTranslation(language, 'navigation')
    const router = useRouter()
    const {t: headerText} = useTranslation(language, 'header')
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const containerRef = useRef(null)
    const {auth, onLoginClick, onSignUpClick, onSignOutClick} = useAuthenticationActions(language)

    const dispatch = useAppDispatch()
    const showCalculatorModal = () => {
        dispatch(openModal({modalType: 'calculator', data: null}))
    }

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    const menuTransition = useTransition(isMenuOpen, {
        from: {
            transform: 'translateX(100%)',
        },
        enter: {
            transform: 'translateX(0)',
        },
        leave: {
            transform: 'translateX(100%)',
        },
    })

    const backgroundTransition = useTransition(isMenuOpen, {
        from: {
            opacity: 0,
        },
        enter: {
            opacity: 1,
        },
        leave: {
            opacity: 0,
        },
    })

    const languageOptions = [
        {id: 'ru', value: 'ru', label: <LanguageDropdownItem value={'ru'}/>},
        {id: 'en', value: 'en', label: <LanguageDropdownItem value={'en'}/>},
        {id: 'zh', value: 'zh', label: <LanguageDropdownItem value={'zh'}/>},
    ]
    const selectedLanguage = languageOptions.find(option => option.value === language) ?? languageOptions[0]

    return (
        <>
            <div className={'hidden md:block sticky top-0 z-20'}>
                <div
                    className={'bg-gray z-10 flex flex-row items-center justify-between py-4 px-5 md:items-center md:w-full md:px-20 md:py-4'}>
                    <Link href={'/'}>
                        <Image src={'/assets/logo.svg'} alt={'logo'} width={85} height={58} placeholder={'empty'}/>
                    </Link>
                    <nav>
                        <ul className={'md:flex md:flex-row md:justify-between md:items-center md:gap-x-10 md:list-none'}>
                            {
                                /\/(ru|en|zh)$/.exec(pathname) &&
                                <>
                                    <li>
                                        <Link href={'#about_us'}>
                                            {t('about_us')}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href={'#how_it_works'}>
                                            {t('how_it_works')}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href={'#calculator'}>
                                            {t('calculator')}
                                        </Link>
                                    </li>
                                </>
                            }
                            {
                                /\/(ru|en|zh)\/profile/.exec(pathname) &&
                                <li className={'md:cursor-pointer'} onClick={showCalculatorModal}>
                                    <p className={'md:text-base'}>
                                        {t('calculator')}
                                    </p>
                                </li>
                            }
                            <li>
                                <div className={'flex flex-row justify-center items-center'}>
                                    <OptionSelect
                                        id={'language'}
                                        options={languageOptions}
                                        searchable={false}
                                        selected={selectedLanguage}
                                        setSelected={value => {
                                            switch (value?.id) {
                                                case 'ru':
                                                    router.replace(`/ru/${pathnameWithoutLanguage}`)
                                                    break
                                                case 'en':
                                                    router.replace(`/en/${pathnameWithoutLanguage}`)
                                                    break
                                                case 'zh':
                                                    router.replace(`/zh/${pathnameWithoutLanguage}`)
                                                    break
                                                default:
                                                    break
                                            }
                                        }}
                                        wrapperClassname={'relative inline-flex min-w-0 p-0 w-36'}
                                        className={'cursor-pointer md:text-[0.9rem] w-full p-4 disabled:bg-gray disabled:text-[#cccccc] disabled:cursor-not-allowed disabled:border-0'}
                                        inputWrapperClassname={'w-full'}
                                        dropdownClassname={'md:max-h-60 z-50 overflow-auto bg-white border md:mx-0 my-3 md:w-full rounded-3xl border-black'}
                                        dropdownItemClassname={'cursor-pointer p-4 border-b border-b-gray hover:bg-gray last:border-0'}
                                        label={''}/>
                                </div>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
            <div className={'block md:hidden sticky top-0 z-20'}>
                <div
                    className={'bg-gray z-10 flex flex-row items-center justify-between h-20 px-5 md:items-center md:w-full md:px-20 md:py-4'}>
                    <Link href={'/'}>
                        <Image src={'/assets/logo.svg'} alt={'logo'} width={50} height={58} placeholder={'empty'}
                               objectFit={'contain'}/>
                    </Link>
                    <nav
                        ref={containerRef} className={'flex flex-row'}>
                        <OptionSelect
                            id={'language'}
                            options={languageOptions}
                            searchable={false}
                            selected={selectedLanguage}
                            setSelected={value => {
                                switch (value?.id) {
                                    case 'ru':
                                        router.replace(`/ru/${pathnameWithoutLanguage}`)
                                        break
                                    case 'en':
                                        router.replace(`/en/${pathnameWithoutLanguage}`)
                                        break
                                    case 'zh':
                                        router.replace(`/zh/${pathnameWithoutLanguage}`)
                                        break
                                    default:
                                        break
                                }
                            }}
                            wrapperClassname={'inline-flex min-w-0 p-0 w-36'}
                            className={'cursor-pointer md:text-[0.9rem] w-full p-4 disabled:bg-gray disabled:text-[#cccccc] disabled:cursor-not-allowed disabled:border-0'}
                            inputWrapperClassname={'w-full'}
                            dropdownClassname={'md:max-h-60 z-50 overflow-auto bg-white border md:mx-0 my-3 w-full rounded-3xl border-black'}
                            dropdownItemClassname={'cursor-pointer p-4 border-b border-b-gray hover:bg-gray last:border-0'}
                            label={''}/>
                        <MenuToggle isOpen={isMenuOpen} toggle={toggleMenu}/>
                    </nav>
                </div>
                {
                    backgroundTransition((backgroundStyle, isMenuOpen) => isMenuOpen &&
                        <animated.div
                            style={backgroundStyle}
                            className={'absolute top-25 right-0 w-full h-[calc(100dvh-5rem)] z-50'}>
                            <div className={'absolute w-full h-full bg-black opacity-70 touch-none'}
                                 onClick={toggleMenu}/>
                            {
                                menuTransition((menuStyle, isMenuOpen) => isMenuOpen &&
                                    <animated.ul
                                        className={'absolute right-0 flex flex-col list-none bg-gray w-full h-full touch-none'}
                                        style={menuStyle}>
                                        <div className={'flex flex-col justify-between h-full'}>
                                            {
                                                /\/(ru|en|zh|kk)$/.exec(pathname) &&
                                                <div>
                                                    <MenuItem text={t('about_us')} link={'#about_us'}
                                                              onClick={toggleMenu}/>
                                                    <MenuItem text={t('how_it_works')} link={'#how_it_works'}
                                                              onClick={toggleMenu}/>
                                                    <MenuItem text={t('calculator')} link={'#calculator'}
                                                              onClick={toggleMenu}/>
                                                </div>
                                            }
                                            {
                                                /\/(ru|en|zh|kk)\/profile/.exec(pathname) &&
                                                <div className={'hidden md:block'}>
                                                    <MenuItem text={t('calculator')} link={'#calculator'}
                                                              onClick={showCalculatorModal}/>
                                                </div>
                                            }
                                            <div>
                                                {
                                                    auth?.status === 'loading' &&
                                                    <>
                                                        <MenuItem onClick={() => {
                                                        }}>
                                                            <div
                                                                className={'md:h-3 md:bg-dark-gray md:rounded md:col-span-2 md:w-28'}></div>
                                                        </MenuItem>
                                                        <MenuItem onClick={() => {
                                                        }}>
                                                            <div
                                                                className={'md:h-3 md:bg-dark-gray md:rounded md:col-span-2 md:w-28'}></div>
                                                        </MenuItem>
                                                    </>
                                                }
                                                {
                                                    auth?.status === 'unauthenticated' &&
                                                    <>
                                                        <MenuItem onClick={() => {
                                                            onLoginClick().then(_ => toggleMenu())
                                                        }}>
                                                            <button
                                                                className={'md:cursor-pointer md:text-white md:px-5 md:py-3 md:rounded-full md:border-none md:bg-none'}>
                                                        <span className={'text-base font-normal'}>
                                                            {headerText('login')}
                                                        </span>
                                                            </button>
                                                        </MenuItem>
                                                        <MenuItem onClick={() => {
                                                            onSignUpClick()
                                                            toggleMenu()
                                                        }}>
                                                            <button
                                                                className={'md:cursor-pointer md:text-white md:bg-blue md:px-5 md:py-3 md:rounded-full md:border-none md:hover:text-black'}
                                                                onClick={onSignUpClick}>
                                                            <span
                                                                className={'md:text-base md:font-normal'}>
                                                                {headerText('register')}
                                                            </span>
                                                            </button>
                                                        </MenuItem>
                                                    </>
                                                }
                                                {
                                                    auth?.status === 'authenticated' &&
                                                    <>
                                                        <Link href={'/profile'}>
                                                            <MenuItem onClick={toggleMenu}>
                                                                <div
                                                                    className={'cursor-pointer gap-x-3 md:text-white md:px-5 md:py-3 md:rounded-full md:border-none md:bg-none flex flex-row md:gap-x-5 md:items-center w-full'}>
                                                                    <Image src={'/assets/user-circle.svg'}
                                                                           alt={'user-avatar'}
                                                                           width={24}
                                                                           height={24} className={'md:hidden'}/>
                                                                    <Image src={'/assets/user-circle-white.svg'}
                                                                           alt={'user-avatar'}
                                                                           width={24}
                                                                           height={24} className={'hidden md:block'}/>
                                                                    <span
                                                                        className={'md:text-base md:font-normal'}>{auth.session.user.name}</span>
                                                                </div>
                                                            </MenuItem>
                                                        </Link>
                                                        <MenuItem onClick={() => {
                                                            onSignOutClick().then(_ => toggleMenu())
                                                        }}>
                                                            <button
                                                                className={'md:cursor-pointer md:text-white md:px-5 md:py-3 md:rounded-full md:border-0 md:bg-none'}>
                                                        <span className={'md:text-base md:font-normal'}>
                                                            {headerText('logout')}
                                                        </span>
                                                            </button>
                                                        </MenuItem>
                                                    </>
                                                }
                                            </div>
                                        </div>
                                    </animated.ul>,
                                )
                            }
                        </animated.div>,
                    )
                }
            </div>
        </>
    )
}

function LanguageDropdownItem({value}: Readonly<{ value: string }>) {
    switch (value) {
        case 'ru':
            return (
                <div
                    className={'flex flex-row items-center justify-start'}>
                    <RU className={'w-5 h-5 mr-2 inline-block'}/>
                    Русский
                </div>
            )
        case 'en':
            return (
                <div
                    className={'flex flex-row items-center justify-start'}>
                    <GB className={'w-5 h-5 mr-2 inline-block'}/>
                    English
                </div>
            )
        case 'zh':
            return (
                <div
                    className={'flex flex-row items-center justify-start'}>
                    <CN className={'w-5 h-5 mr-2 inline-block'}/>
                    中文
                </div>
            )
        default:
            return ''
    }
}