export interface TicketType {
  id: string;
  name: string;
  type: string;
  price: string;
  quantityLimit: number;
  soldQuantity: number;
  startSaleTime: string;
  endSaleTime: string;
  description?: string;
  status: string;
}

export interface EventDetail {
  id: string;
  title: string;
  slug: string;
  description: string;
  bannerUrl: string;
  location: string;
  startTime: string;
  endTime: string;
  status: string;
  organizer: {
    fullName: string;
    email: string;
  };
}
