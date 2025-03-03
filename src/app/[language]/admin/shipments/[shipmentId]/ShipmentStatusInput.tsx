"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { updateShipment } from "@/services/shipments";
import { ShipmentData } from "@/types/entities";

type Props = {
    shipment: ShipmentData;
    setShipment: (shipment: ShipmentData) => void;
};

const statuses = [
    { id: "CREATED", label: "Created" },
    { id: "IN_TRANSIT", label: "In Transit" },
    { id: "DELIVERED", label: "Delivered" },
    { id: "CANCELLED", label: "Cancelled" },
];

export default function ShipmentStatusInput({ shipment, setShipment }: Readonly<Props>) {
    const [loading, setLoading] = useState(false);

    const onStatusChange = async (newStatus: string) => {
        setLoading(true);
        toast.promise(
            updateShipment({ status: newStatus }, shipment.id),
            {
                pending: "Updating status...",
                success: "Status updated successfully!",
                error: "Failed to update status.",
            }
        ).then(() => {
            setShipment({ ...shipment, status: newStatus });
        }).catch(console.error).finally(() => {
            setLoading(false);
        });
    };

    return (
        <div className="relative">
            <select
                className="border border-gray-300 rounded-md p-2 w-full"
                value={shipment.status}
                onChange={(e) => onStatusChange(e.target.value)}
                disabled={loading}
            >
                {statuses.map((status) => (
                    <option key={status.id} value={status.id}>
                        {status.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
