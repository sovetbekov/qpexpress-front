import { ErrorResponse } from '@/types'

export async function getTrackingData(trackNum: string) {
  const options = {
    requestOptions: {
      next: {
        tags: ['deliveries'],
      },
    },
  }
  const response = await fetch(`https://track.post.kz/api/v2/${trackNum}/events`, {
    ...options?.requestOptions,
  })
  if (!response.ok) {
    const errorResponse = {
      status: 'error',
      error: {
        serverError: [`Failed to fetch: ${response.status}`],
      },
    } as ErrorResponse
    console.log(trackNum, errorResponse)
    return errorResponse
  } else {
    return {
      status: 'success',
      data: await response.json(),
    }
  }
}
