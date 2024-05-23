import { getAddresses } from '@/services/addresses';
import PageWrapper from '../PageWrapper';
import { isError } from '@/app/lib/utils';
import dynamicImport from 'next/dynamic';

const AddressCard = dynamicImport(() => import('./AddressCard'), { ssr: false });

export const dynamic = 'force-dynamic';

type Props = {
    params: {
        language: string;
    };
};

export default async function Page({ params: { language } }: Readonly<Props>) {
    const addressesResponse = await getAddresses(language);
    if (isError(addressesResponse)) {
        return <div>Ошибка</div>;
    }
    const addresses = addressesResponse.data;

    return (
        <PageWrapper>
            <div className={'px-5 md:p-0'}>
                <h2 className={'text-2xl mb-5 md:hidden'}>Мои адреса</h2>
                <div className={'flex flex-col gap-y-5 md:flex-row md:flex-wrap md:gap-x-5 w-full'}>
                    {addresses.map(address => (
                        <AddressCard key={address.id} address={address} language={language} />
                    ))}
                </div>
            </div>
        </PageWrapper>
    );
}
