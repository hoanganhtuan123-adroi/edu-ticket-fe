export enum TicketType {
  REGULAR = 'REGULAR',
  VIP = 'VIP',
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
  description?: string;
  requiresApproval?: boolean;
}

export interface EventStaffDto {
  userId: string;
  staffRole?: string;
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
  requiresApproval?: boolean;
}

export interface CreateEventDto {
  categoryId: number;
  title: string;
  description?: string;
  location: string;
  startTime: string;
  endTime: string;
  startSaleTime?: string;
  endSaleTime?: string;
  ticketTypes?: CreateTicketDto[];
  settings?: string | Record<string, any>;
  checkInStaff?: EventStaffDto[];
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
  isVisible?: boolean;
  organizerId?: string;
  bannerUrl?: string;
  ticketTypes?: TicketTypeData[];
  settings?: string | Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
  category?: Category;
  categoryName?: string;
  ticketTypeCount?: number;
  bookingCount?: number;
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
  eventStaff?: {
    id: string;
    fullName: string;
    studentCode?: string;
    email: string;
    staffRole: string;
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
