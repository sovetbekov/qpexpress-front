"use server";

import { revalidateTag } from "next/cache";
import { ShipmentData, EditShipmentData } from "@/types/entities";
import { makeRequest } from "@/services/utils";

export async function getMyShipments() {
  return await makeRequest<ShipmentData[]>("v1/my/shipments");
}

export async function getShipments() {
  return await makeRequest<ShipmentData[]>("v1/shipments", {
    requestOptions: {
      next: {
        tags: ["shipments"],
      },
    },
  });
}

export async function getShipment(shipmentId: string) {
  return await makeRequest<ShipmentData>(`v1/shipments/${shipmentId}`, {
    requestOptions: {
      next: {
        tags: ["shipments"],
      },
    },
  });
}

export async function updateShipment(
  data: EditShipmentData,
  shipmentId: string
) {
  console.info(shipmentId, "shipmentId");
  console.info(JSON.stringify(data), "update");
  return await makeRequest<EditShipmentData>(`v1/shipments/${shipmentId}`, {
    requestOptions: {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    },
    postRequest: () => revalidateTag("shipments"),
  });
}
