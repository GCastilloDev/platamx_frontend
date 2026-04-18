export interface ProductImage {
  id: number;
  file_name: string;
  url: string;
}

export interface ProductVariant {
  id: number;
  name: string;
}

export interface ProductCollection {
  id: number;
  name: string;
  name_en?: string;
  description?: string;
  description_en?: string;
}

export interface Product {
  id: number;
  name: string;
  name_en?: string;
  description: string;
  description_en?: string;
  price: string | number;
  price_usd?: string | number;
  images: ProductImage[];
  variants: ProductVariant[];
  collections: ProductCollection[];
}

export interface CartItem {
  shoppingCartItemId: number;
  nameItem: string;
  nameItem_en?: string;
  quantity: number;
  total: number;
  totalUsd: number;
  imageUrl: string;
}

export interface Order {
  id: number;
  folio: string;
  productName: string;
  productName_en?: string;
  datePurchase: string;
  total: number;
  totalUsd: number;
  subTotal: number;
  subTotalUsd: number;
  deliveryCost: number;
  deliveryCostUsd: number;
  payment_currency: 'MXN' | 'USD';
  shipment_status: 'PENDING' | 'SHIPPED' | 'DELIVERED';
  tracking_url?: string;
}

export interface UserAddress {
  street?: string;
  streat?: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  address: UserAddress;
}
