'use server'

import { FileMetaData } from '@/types/entities'
import { makeRequest } from '@/services/utils'

export async function getFileById(id: string) {
    return await makeRequest<FileMetaData>(`v1/files/${id}`)
}

export async function uploadFile(data: FormData) {
    return await makeRequest<FileMetaData>('v1/files', {
        requestOptions: {
            method: 'POST',
            body: data,
        },
    })
}