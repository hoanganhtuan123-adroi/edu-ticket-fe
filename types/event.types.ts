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
  PENDING_APPROVAL = 'PENDING_APPROVAL', // Match backend
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

export interface TicketTypeData {
  id: string;
  name: string;
  type: TicketType;
  price: string;
  quantityLimit: number;
  soldQuantity: number;
  startSaleTime: string;
  endSaleTime: string;
  description?: string;
  status: string;
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
  slug?: string;
  description?: string;
  location?: string;
  startTime?: string;
  endTime?: string;
  status?: EventStatus;
  organizerId?: string;
  bannerUrl?: string;
  ticketTypes?: TicketTypeData[];
  settings?: string | Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
  category?: Category;
  approvalHistory?: {
    id: string;
    action: string;
    reason?: string;
    createdAt: string;
    admin: {
      fullName?: string;
      email: string;
    };
  }[];
  organizer?: {
    id: string;
    email: string;
  };
  attachments?: {
    id: string;
    fileName: string;
    fileSize: number;
    fileType: string;
    fileUrl: string;
  }[];
}

export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface EventDetailResponse {
  success: boolean;
  message: string;
  data?: Event;
  timestamp?: string;
}
