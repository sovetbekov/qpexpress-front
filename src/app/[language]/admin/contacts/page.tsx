import PageWrapper from '@/app/[language]/profile/PageWrapper'
import { getContacts } from '@/services/contacts'
import ContactsTable from '@/app/[language]/admin/contacts/ContactsTable'
import { isError } from '@/app/lib/utils'

export const dynamic = 'force-dynamic'

export default async function Page() {
    const contactsResponse = await getContacts()
    if (isError(contactsResponse)) {
        return <div>Ошибка</div>
    }
    const contacts = contactsResponse.data
    
    return (
        <PageWrapper>
            <div className={'flex flex-col w-full md:col-start-2 md:col-span-1'}>
                <h2 className={'text-2xl mb-5 md:hidden'}>Контакты</h2>
                <div className={''}>
                    <ContactsTable contacts={contacts} />
                </div>
            </div>
        </PageWrapper>
    )
}
