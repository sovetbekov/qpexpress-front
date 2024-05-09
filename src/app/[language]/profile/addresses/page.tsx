import { getAddresses } from '@/services/addresses'
import PageWrapper from '../PageWrapper'
import { isError } from '@/app/lib/utils'
import ClickableElement from './ClickableElement'

export const dynamic = 'force-dynamic'

type Props = {
    params: {
        language: string,
    }
}

export default async function Page({params: {language}}: Readonly<Props>) {
    const addressesResponse = await getAddresses(language)
    if (isError(addressesResponse)) {
        return <div>Ошибка</div>
    }
    const addresses = addressesResponse.data

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text)
            console.log('Text copied to clipboard:', text)
        } catch (error) {
            console.error('Failed to copy text to clipboard:', error)
        }
    }

    return (
        <PageWrapper>
            <div className={'px-5 md:p-0'}>
                <h2 className={'text-2xl mb-5 md:hidden'}>Мои адреса</h2>
                <div className={'flex flex-col gap-y-5 md:flex-row md:flex-wrap md:gap-x-5 w-full'}>
                    {
                        addresses.map(address => {
                            return (
                                <div className={'w-full p-5 md:p-10 bg-gray rounded-3xl md:w-[calc(50%-1em)]'} key={address.id}>
                                    <h2 className={'text-xl'}>{address.country}</h2>
                                    <br className={'h-2.5'}/>
                                    <div className={'flex flex-col gap-y-2'}>
                                        {
                                            address.city && (
                                                <ClickableElement text={address.city} params={{language}} />
                                            )  
                                        }
                                        {
                                            address.district && (
                                                <ClickableElement text={address.district} params={{language}} />
                                            )  
                                        }
                                        {
                                            address.neighborhood && (
                                                <ClickableElement text={address.neighborhood} params={{language}} />
                                            )  
                                        }
                                        {
                                            address.street && (
                                                <ClickableElement text={address.street} params={{language}} />
                                            )  
                                        }
                                        {
                                            address.house && (
                                                <ClickableElement text={address.house} params={{language}} />
                                            )  
                                        }
                                        {
                                            address.postcode && (
                                                <ClickableElement text={address.postcode} params={{language}} />
                                            )  
                                        }
                                        {/* {
                                            address.city && (
                                                <div className={'flex flex-row justify-between w-full'}>
                                                    {address.city.split('~').map(text => (
                                                        <p className={'text-base'} key={text}>{text}</p>))}
                                                </div>
                                            )
                                        }
                                        {
                                            address.district && (
                                                <div className={'flex flex-row justify-between w-full'}>
                                                    {address.district.split('~').map(text => (
                                                        <p className={'text-base'} key={text}>{text}</p>))}
                                                </div>
                                            )
                                        }
                                        {
                                            address.neighborhood && (
                                                <div className={'flex flex-row justify-between w-full'}>
                                                    {address.neighborhood.split('~').map(text => (
                                                        <p className={'text-base'} key={text}>{text}</p>))}
                                                </div>
                                            )
                                        }
                                        {
                                            address.street && (
                                                <div className={'flex flex-row justify-between w-full'}>
                                                    {address.street.split('~').map(text => (
                                                        <p className={'text-base'} key={text}>{text}</p>))}
                                                </div>
                                            )
                                        }
                                        {
                                            address.house && (
                                                <div className={'flex flex-row justify-between w-full'}>
                                                    {address.house.split('~').map(text => (
                                                        <p className={'text-base'} key={text}>{text}</p>))}
                                                </div>
                                            )
                                        }
                                        {
                                            address.postcode && (
                                                <div className={'flex flex-row justify-between w-full'}>
                                                    {address.postcode.split('~').map(text => (
                                                        <p className={'text-base'} key={text}>{text}</p>))}
                                                </div>
                                            )
                                        } */}
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </PageWrapper>
    )
}