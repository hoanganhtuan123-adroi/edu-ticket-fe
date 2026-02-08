export enum TicketType {
  REGULAR = 'REGULAR',
  VIP = 'VIP',
  EARLY_BIRD = 'EARLY_BIRD',
  STUDENT = 'STUDENT',
  GROUP = 'GROUP',
  SPONSOR = 'SPONSOR',
  FREE = 'FREE',
}

export enum EventStatus {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING',
  APPROVED = 'APPROVED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export interface CreateTicketDto {
  name: string;
  type?: TicketType;
  price: number;
  quantityLimit: number;
  startSaleTime?: string;
  endSaleTime?: string;
  description?: string;
}

export interface CreateEventDto {
  categoryId: number;
  title: string;
  description?: string;
  location: string;
  startTime: string;
  endTime: string;
  ticketTypes?: CreateTicketDto[];
  settings?: string | Record<string, any>;
}

export interface Event {
  id: string;
  categoryId: number;
  title: string;
  description?: string;
  location: string;
  startTime: string;
  endTime: string;
  status: EventStatus;
  organizerId: string;
  ticketTypes?: CreateTicketDto[];
  settings?: string | Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
}
