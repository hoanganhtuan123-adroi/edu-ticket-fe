export interface CreateSupportRequestDto {
  title: string;
  description: string;
  attachments?: string[];
  eventId?: string;
}

export interface SupportRequestResponseDto {
  id: string;
  createdAt: string;
  updatedAt: string;
  ticketCode: string;
  title: string;
  status: string;
  lastRepliedBy: string | null;
  closedAt: string | null;
}

export interface AdminSupportRequestResponseDto {
  id: string;
  createdAt: string;
  updatedAt: string;
  ticketCode: string;
  title: string;
  status: string;
  closedAt: string | null;
  requesterName?: string;
}

export interface SupportRequestDetailResponseDto {
  id: string;
  createdAt: string;
  updatedAt: string;
  ticketCode: string;
  title: string;
  description: string;
  requesterId: string;
  status: string;
  lastRepliedBy: string | null;
  closedAt: string | null;
  messages: any[];
  attachments: SupportAttachmentDto[];
  requester: SupportRequesterDto;
}

export interface SupportAttachmentDto {
  createdAt: string;
  updatedAt: string;
  supportRequestId: string;
  messageId: string | null;
  uploadedBy: string;
  fileName: string;
  fileUrl: string;
  filePath: string;
  fileSize: string;
  mimeType: string;
}

export interface SupportRequesterDto {
  email: string;
  fullName: string;
  phoneNumber: string;
  systemRole: string;
  faculty: string;
}

export interface CreateSupportResponse {
  success: boolean;
  message: string;
  data?: SupportRequestResponseDto;
  timestamp?: string;
}

export interface GetSupportRequestsResponse {
  success: boolean;
  message: string;
  data?: {
    data: SupportRequestResponseDto[];
    pagination: {
      limit: number;
      offset: number;
      total: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
  timestamp?: string;
}

export interface GetSupportRequestDetailResponse {
  success: boolean;
  message: string;
  data?: SupportRequestDetailResponseDto;
  timestamp?: string;
}

export interface FilterSupportRequestDto {
  limit?: number;
  offset?: number;
  status?: string;
  title?: string;
  ticketCode?: string;
}
