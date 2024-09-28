import { makeRequestNoAuth } from '@/services/utils'
import { ContactData, CreateContactData } from '@/types/entities'

export async function createContact(data: CreateContactData) {
  console.info(data, 'create')
  return await makeRequestNoAuth('v1/applications', {
    requestOptions: {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    },
  })
}

export async function getContacts() {
  return await makeRequestNoAuth<ContactData[]>('v1/applications', {
    requestOptions: {
      method: 'GET',
      // next: {
      //     tags: ['deliveries'],
      // },
    },
  })
}
