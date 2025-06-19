import { ShipterServiceErrorResponse, ShipterServiceSuccessResponse } from '@/types/entities'
// Combined type that can be either success or error
type ShipterServiceResponse = ShipterServiceSuccessResponse | ShipterServiceErrorResponse;


export function isShipterServiceSuccess(
  response: ShipterServiceResponse
): response is ShipterServiceSuccessResponse {
  return response.result === "success";
}