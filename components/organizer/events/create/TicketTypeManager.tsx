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
    requiresApproval: false,
  });

  // Auto set price to 0 when type is FREE
  const handleTicketTypeChange = (index: number, type: TicketType) => {
    const updatedTickets = [...ticketTypes];
    updatedTickets[index] = { 
      ...updatedTickets[index], 
      type,
      price: type === TicketType.FREE ? 0 : updatedTickets[index].price
    };
    onTicketTypesChange(updatedTickets);
  };

  // Auto set price to 0 when type is FREE for new ticket
  const handleNewTicketTypeChange = (type: TicketType) => {
    setNewTicket({ 
      ...newTicket, 
      type,
      price: type === TicketType.FREE ? 0 : newTicket.price
    });
  };

  const addTicketType = () => {
    if (!newTicket.name.trim()) {
      alert('Vui lòng nhập tên loại vé');
      return;
    }

    // Validate price for non-FREE tickets
    if (newTicket.type !== TicketType.FREE && newTicket.price <= 0) {
      alert('Vé thường và VIP phải có giá lớn hơn 0');
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
      requiresApproval: false,
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
                      onChange={(e) => handleTicketTypeChange(index, e.target.value as TicketType)}
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
                      Giá vé (VNĐ) {ticket.type === TicketType.FREE ? '(Miễn phí)' : '*'}
                    </label>
                    <input
                      type="number"
                      value={ticket.price}
                      onChange={(e) => updateTicketType(index, 'price', Number(e.target.value))}
                      disabled={ticket.type === TicketType.FREE}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-10 ${
                        ticket.type === TicketType.FREE 
                          ? 'bg-gray-100 border-gray-300 cursor-not-allowed' 
                          : 'border-gray-300'
                      }`}
                      placeholder={ticket.type === TicketType.FREE ? '0' : 'Nhập giá vé'}
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-10"
                      placeholder="100"
                      min="1"
                    />
                  </div>
                </div>
                
                {ticket.type === TicketType.FREE && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500">Vé miễn phí có giá mặc định là 0</p>
                  </div>
                )}
                
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
                
                <div className="mt-4">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ticket.requiresApproval || false}
                      onChange={(e) => updateTicketType(index, 'requiresApproval', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Yêu cầu duyệt vé
                    </span>
                  </label>
                  <p className="mt-1 text-xs text-gray-500">
                    Nếu bật, người đăng ký vé này sẽ cần được admin duyệt trước khi vé được kích hoạt
                  </p>
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
                onChange={(e) => handleNewTicketTypeChange(e.target.value as TicketType)}
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
                Giá vé (VNĐ) {newTicket.type === TicketType.FREE ? '(Miễn phí)' : '*'}
              </label>
              <input
                type="number"
                value={newTicket.price}
                onChange={(e) => setNewTicket({ ...newTicket, price: Number(e.target.value) })}
                disabled={newTicket.type === TicketType.FREE}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-10 ${
                  newTicket.type === TicketType.FREE 
                    ? 'bg-gray-100 border-gray-300 cursor-not-allowed' 
                    : 'border-gray-300'
                }`}
                placeholder={newTicket.type === TicketType.FREE ? '0' : 'Nhập giá vé'}
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-10"
                placeholder="100"
                min="1"
              />
            </div>
          </div>
          
          {newTicket.type === TicketType.FREE && (
            <div className="mt-2">
              <p className="text-xs text-gray-500">Vé miễn phí có giá mặc định là 0</p>
            </div>
          )}
          
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
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={newTicket.requiresApproval || false}
                onChange={(e) => setNewTicket({ ...newTicket, requiresApproval: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Yêu cầu duyệt vé
              </span>
            </label>
            <p className="mt-1 text-xs text-gray-500">
              Nếu bật, người đăng ký vé này sẽ cần được admin duyệt trước khi vé được kích hoạt
            </p>
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
