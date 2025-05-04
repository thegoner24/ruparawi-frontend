import React from "react";
import { FaMapMarkerAlt, FaEdit, FaTrash } from "react-icons/fa";

export interface Address {
  id: number;
  address_line1: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
  isDefault?: boolean;
}

export default function AddressCard({ address, onEdit, onDelete }: { address: Address; onEdit?: (address: Address) => void; onDelete?: (address: Address) => void }) {
  return (
    <div className={`rounded-xl border p-5 shadow flex flex-col gap-2 ${address.isDefault ? 'border-pink-500' : 'border-gray-200'}`}>
      <div className="flex items-center gap-2">
        <FaMapMarkerAlt className="text-pink-500" />
        <span className="font-semibold text-lg">{address.address_line1}</span>
        {address.isDefault && <span className="ml-2 px-2 py-0.5 text-xs rounded bg-pink-100 text-pink-700">Default</span>}
      </div>
      <div className="text-gray-700">{address.city}, {address.state}, {address.postal_code}, {address.country}</div>
      <div className="text-gray-500 text-sm">Phone: {address.phone}</div>
      <div className="flex gap-2 mt-2 self-end">
        {onEdit && (
          <button
            className="flex items-center gap-1 px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm"
            onClick={() => onEdit(address)}
          >
            <FaEdit /> Edit
          </button>
        )}
        {onDelete && (
          <button
            className="flex items-center gap-1 px-3 py-1 rounded bg-red-100 hover:bg-red-200 text-red-600 text-sm"
            onClick={() => onDelete(address)}
          >
            <FaTrash /> Delete
          </button>
        )}
      </div>
    </div>
  );
}
