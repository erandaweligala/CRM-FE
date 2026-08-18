export interface OrderItem {
    orderItemState: string;
    quantity: string;
    productOffering: string; 
    orderItemID: string;
    itemPrice: string;
  }

export interface OrdersModel {
  statusDate: string;
  orderType: string;
  orderID: string;
  totalPrice: string;
  channel: string;
  orderDate: string;
  orderAction: string;
  status: string;
  orderItems: OrderItem[];
}

export interface OrdersRequestModel {
    orderId?: string;
	fromDate?: string; // 2023-01-01
	toDate?: string; // 2023-03-03
	serviceReference?: string;
	status?: string; 
}

export interface OrderStatusFlowModel {
  dateTime: string;
  action: string;
  description: string;
  id: string;
  status: string;
}