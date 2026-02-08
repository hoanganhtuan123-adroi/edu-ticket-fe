"use client";

import { useState } from 'react';
import { CreateTicketDto, TicketType } from '@/types/event.types';

interface TicketTypeManagerProps {
  ticketTypes: CreateTicketDto[];
  onTicketTypesChange: (ticketTypes: CreateTicketDto[]) => void;
}

export default function TicketTypeManager({ ticketTypes, onTicketTypesChange }: TicketTypeManagerProps) {
  const [newTicket, setNewTicket] = useState<CreateTicketDto>({
    name: '',
    type: TicketType.REGULAR,
    price: 0,
    quantityLimit: 100,
    description: '',
  });

  const addTicketType = () => {
    if (!newTicket.name.trim()) {
      alert('Vui lòng nhập tên loại vé');
      return;
    }

    if (newTicket.price < 0) {
      alert('Giá vé không được âm');
      return;
    }

    if (newTicket.quantityLimit <= 0) {
      alert('Số lượng giới hạn phải lớn hơn 0');
      return;
    }

    onTicketTypesChange([...ticketTypes, { ...newTicket }]);
    setNewTicket({
      name: '',
      type: TicketType.REGULAR,
      price: 0,
      quantityLimit: 100,
      description: '',
    });
  };

  const removeTicketType = (index: number) => {
    onTicketTypesChange(ticketTypes.filter((_, i) => i !== index));
  };

  const updateTicketType = (index: number, field: keyof CreateTicketDto, value: any) => {
    const updatedTickets = [...ticketTypes];
    updatedTickets[index] = { ...updatedTickets[index], [field]: value };
    onTicketTypesChange(updatedTickets);
  };

  const getTicketTypeLabel = (type: TicketType) => {
    const labels = {
      [TicketType.REGULAR]: 'Thường',
      [TicketType.VIP]: 'VIP',
      [TicketType.EARLY_BIRD]: 'Early Bird',
      [TicketType.STUDENT]: 'Sinh viên',
      [TicketType.GROUP]: 'Nhóm',
      [TicketType.SPONSOR]: 'Nhà tài trợ',
      [TicketType.FREE]: 'Miễn phí',
    };
    return labels[type] || type;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Loại vé sự kiện</h3>
        
        {/* Existing ticket types */}
        {ticketTypes.length > 0 && (
          <div className="space-y-4 mb-6">
            {ticketTypes.map((ticket, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tên loại vé *
                    </label>
                    <input
                      type="text"
                      value={ticket.name}
                      onChange={(e) => updateTicketType(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Vé thường, VIP, etc."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Loại vé
                    </label>
                    <select
                      value={ticket.type}
                      onChange={(e) => updateTicketType(index, 'type', e.target.value as TicketType)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {Object.values(TicketType).map((type) => (
                        <option key={type} value={type}>
                          {getTicketTypeLabel(type)}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Giá vé (VNĐ) *
                    </label>
                    <input
                      type="number"
                      value={ticket.price}
                      onChange={(e) => updateTicketType(index, 'price', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số lượng giới hạn *
                    </label>
                    <input
                      type="number"
                      value={ticket.quantityLimit}
                      onChange={(e) => updateTicketType(index, 'quantityLimit', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="100"
                      min="1"
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mô tả
                  </label>
                  <textarea
                    value={ticket.description || ''}
                    onChange={(e) => updateTicketType(index, 'description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={2}
                    placeholder="Mô tả chi tiết về loại vé này..."
                  />
                </div>
                
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeTicketType(index)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add new ticket type */}
        <div className="border border-gray-200 rounded-lg p-4 bg-blue-50">
          <h4 className="font-medium text-gray-900 mb-4">Thêm loại vé mới</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên loại vé *
              </label>
              <input
                type="text"
                value={newTicket.name}
                onChange={(e) => setNewTicket({ ...newTicket, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Vé thường, VIP, etc."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loại vé
              </label>
              <select
                value={newTicket.type}
                onChange={(e) => setNewTicket({ ...newTicket, type: e.target.value as TicketType })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.values(TicketType).map((type) => (
                  <option key={type} value={type}>
                    {getTicketTypeLabel(type)}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giá vé (VNĐ) *
              </label>
              <input
                type="number"
                value={newTicket.price}
                onChange={(e) => setNewTicket({ ...newTicket, price: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
                min="0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số lượng giới hạn *
              </label>
              <input
                type="number"
                value={newTicket.quantityLimit}
                onChange={(e) => setNewTicket({ ...newTicket, quantityLimit: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="100"
                min="1"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả
            </label>
            <textarea
              value={newTicket.description || ''}
              onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
              placeholder="Mô tả chi tiết về loại vé này..."
            />
          </div>
          
          <div className="mt-4">
            <button
              type="button"
              onClick={addTicketType}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Thêm loại vé
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
