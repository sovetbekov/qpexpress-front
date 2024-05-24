'use server'

import { revalidateTag } from 'next/cache'
import { getLanguageBundle, makeRequest } from '@/services/utils'
import {
    ProfileData,
    RecipientData,
    RecipientOverview,
    UserWithRecipientsData,
    UserWithRecipientsOverview,
} from '@/types/entities'
import { FormData as PersonalInfoFormData } from '@/app/[language]/profile/edit/ProfileInfoForm'
import { emailValidator, fileValidator, iinValidator, nonEmptyValidator, patternValidator } from '@/services/validate'

export async function recipientValidators(data: FormData, t: any) {
    return {
        'document_side_a': [{
            validate: fileValidator(data, 'documentSideA'),
            message: t['required_field'],
        }],
        'document_side_b': [{
            validate: fileValidator(data, 'documentSideB'),
            message: t['required_field'],
        }],
        'iin': [{
            validate: nonEmptyValidator(data.get('iin') as string),
            message: t['required_field'],
        }, {
            validate: iinValidator(data.get('iin') as string),
            message: t['invalid_iin'],
        }],
        'first_name': [{
            validate: nonEmptyValidator(data.get('firstName') as string),
            message: t['required_field'],
        }],
        'last_name': [{
            validate: nonEmptyValidator(data.get('lastName') as string),
            message: t['required_field'],
        }],
        'district': [{
            validate: nonEmptyValidator(data.get('district') as string),
            message: t['required_field'],
        }],
        'address': [{
            validate: nonEmptyValidator(data.get('address') as string),
            message: t['required_field'],
        }],
    }
}

export async function getMyProfile() {
    return await makeRequest<ProfileData>('v1/me', {
        requestOptions: {
            next: {
                tags: ['users'],
            },
        },
    })
}

export async function getMyRecipients() {
    const response = await makeRequest<RecipientData[]>('v1/my/recipients', {
        requestOptions: {
            next: {
                tags: ['recipients'],
            },
        },
    });
    return response;
}

export async function updateAccount(data: PersonalInfoFormData, language: string) {
    const t = await getLanguageBundle(language, 'common')
    return await makeRequest<UserWithRecipientsData>('v1/me', {
        requestOptions: {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        },
        postRequest: () => revalidateTag('users'),
        validators: {
            'first_name': [{
                validate: nonEmptyValidator(data.firstName),
                message: t['required_field'],
            }],
            'last_name': [{
                validate: nonEmptyValidator(data.lastName),
                message: t['required_field'],
            }],
            'email': [{
                validate: nonEmptyValidator(data.email),
                message: t['required_field'],
            }, {
                validate: emailValidator(data.email),
                message: t['invalid_email'],
            }],
        }
    })
}

export async function createRecipient(data: FormData, language: string) {
    console.log(data, 'createRecipient')
    const t = await getLanguageBundle(language, 'common')
    return await makeRequest<RecipientData>('v1/my/recipients', {
        requestOptions: {
            method: 'POST',
            body: data,
        },
        postRequest: () => revalidateTag('recipients'),
        validators: await recipientValidators(data, t),
    })
}

export async function updateRecipient(id: string, data: FormData, language: string) {
    console.log(data, 'updateRecipient')

    const t = await getLanguageBundle(language, 'common')
    return await makeRequest<RecipientData>(`v1/my/recipients/${id}`, {
        requestOptions: {
            method: 'PUT',
            body: data,
        },
        postRequest: () => revalidateTag('recipients'),
        validators: await recipientValidators(data, t),
    })
}

export async function denyRecipient(id: string, comment: string, language: string) {
    const t = await getLanguageBundle(language, 'common')
    return await makeRequest<RecipientData[]>(`v1/recipients/${id}/deny`, {
        requestOptions: {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                comment,
            }),
            next: {
                tags: ['recipients'],
            },
        },
        postRequest: () => revalidateTag('recipients'),
        validators: {
            'comment': [{
                validate: nonEmptyValidator(comment),
                message: t['required_field'],
            }],
        }
    })
}

export async function acceptRecipient(id: string) {
    return await makeRequest<RecipientData[]>(`v1/recipients/${id}/accept`, {
        requestOptions: {
            method: 'PATCH',
            next: {
                tags: ['recipients'],
            },
        },
        postRequest: () => revalidateTag('recipients'),
    })
}

export async function getUsers() {
    return await makeRequest<UserWithRecipientsOverview[]>('v1/users', {
        requestOptions: {
            cache: 'no-cache',
        },
    })
}

export async function getUser(id: string) {
    return await makeRequest<UserWithRecipientsData>(`v1/users/${id}`, {
        requestOptions: {
            cache: 'no-cache',
        },
    })
}

export async function getRecipients() {
    return await makeRequest<RecipientOverview[]>('v1/recipients', {
        requestOptions: {
            next: {
                tags: ['recipients'],
            },
        },
    })
}