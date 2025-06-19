import { DeliveryStatus, OrderStatus, RecipientStatus } from "@/types/utils";
import { StyledString } from "next/dist/build/swc";

export type CountryData = {
  id: string;
  nameRus: string;
  nameKaz: string;
  nameEng: string;
  nameChn: string;
};


// Successful response data item interface
export interface ShipterOrderSuccessItem {
  OrderNum: string;
  TrackingNo: string;
  ReceiptNum: string;
}

// Error response data item interface
export interface ShipterOrderErrorItem {
  OrderNo1: string;
  ErrMsgs: string[];
}

// Base response interface with common properties
export interface ShipterServiceBaseResponse {
  result: "success" | "fail";
  data: string;
}

// Success response interface
export interface ShipterServiceSuccessResponse extends ShipterServiceBaseResponse {
  result: "success";
  data2: ShipterOrderSuccessItem[];
}

// Error response interface
export interface ShipterServiceErrorResponse extends ShipterServiceBaseResponse {
  result: "fail";
  data2: ShipterOrderErrorItem[];
}

export type CityData = {
  id: string;
  name: string;
  countryId: string;
};

export type ContactData = {
  id: string;
  phone: string;
  fullName: string;
  creationDate: number[];
  isDeleted: boolean;
};

export type CreateContactData = {
  phone: string;
  fullName: string;
};

export interface ProductData {
  id: string
  createdAt: string
  updatedAt: string
  name: string
  description: string
  quantity: number
  price: number
  weight: number
  barCode: string
  hsCode: string
  isDeleted: boolean
}

export interface ShipmentData {
  id: string
  createdAt: string
  sendDate: string
  updatedAt: string
  orderNumber: string
  trackingNumber: string
  senderCompany: string
  senderPerson: string
  senderPhone: string
  senderTown: string
  senderAddress: string
  receiverPerson: string
  receiverPhone: string
  receiverEmail: string
  receiverTown: string
  receiverAddress: string
  receiverInn: string
  zipCode: string
  products: ProductData[]
  quantity: number
  price: number
  status: string
  isDeleted: boolean
  enclosure: string
  labelNumber: string
  service: string
  pickupDate: string
  spedxOrderResponseNumber: string
}

/**
 * Type definition for statusHistory.
 */
export interface StatusHistory {
  statuses: Array<{
    eventStore: string
    eventTime: string
    createTimeGmt: string
    message: string
    title: string
    eventTown: string
    country: string
    value: string
  }>
}

export type ShipmentDataOverview = Omit<ShipmentData, 'products'>

export type CurrencyData = {
  id: string;
  nameRus: string;
  nameKaz: string;
  nameEng: string;
  nameChn: string;
  code?: string;
};

export type AddressData = {
  id: string;
  country: string;
  city?: string;
  district?: string;
  neighborhood?: string;
  street?: string;
  house?: string;
  postcode?: string;
};

export type FileMetaData = {
  [x: string]: string | StaticImport;
  id: string;
  contentType: string;
  name: string;
};

export type RecipientData = RecipientOverview & {
  iin: string;
  documentSideA: FileMetaData;
  documentSideB: FileMetaData;
  district: string;
  phoneNumber: string;
  address: string;
  comment?: string;
};

export type GoodData = {
  country: CountryData;
  currency: CurrencyData;
  id: string;
  deliveryId?: string;
  name: string;
  link: string;
  description: string;
  orderId: string;
  originalBox: boolean;
  trackingNumber: string;
  status: string;
  price: number;
  quantity: number;
  invoice?: File | FileMetaData;
};

export type TrackingActivity = {
  time: string;
  zip: string;
  city: string;
  name: string;
  x_dep_id: string;
  status: string[];
  dep_code: string;
  nondlv_reason: string | null;
  return_reason: string | null;
  forward_reason: string | null;
};

export type TrackingEvent = {
  date: string;
  activity: TrackingActivity[];
};

export type TrackingData = {
  trackid: string;
  timestamp: string;
  events: TrackingEvent[];
};

export type OrderData = {
  id: string;
  recipient: RecipientData;
  goods: GoodData[];
  orderNumber: string;
  status: OrderStatus;
  createdAt: number[];
};

export type EditOrderData = {
  recipientId: string;
  goods: EditGoodData[];
};

export type EditGoodData = {
  id: string;
  name: string;
  customOrderId: string;
  description: string;
  originalBox: boolean;
  quantity?: number;
  link: string;
  price?: number;
  countryId?: string;
  currencyId?: string;
  trackingNumber?: string; // Add trackingNumber property
  price?: string;
  invoice?: string;
  invoiceUUID?: string;
};

export type DeliveryData = {
  id: string;
  deliveryNumber: string;
  recipient: RecipientData;
  status: DeliveryStatus;
  currency: CurrencyData;
  weight: number;
  price: number;
  goods: GoodData[];
  kazPostTrackNumber: string;
  invoice: FileMetaData;
};

export type MarketplaceData = {
  brand: string;
  category: string;
  description: string;
  description_en: string;
  description_kz: string;
  description_zh: string;
  country: string;
  country_en: string;
  country_kz: string;
  country_zh: string;
  link: string;
  photo_link: string;
};

export type MarketplaceDataOverview = {
  id: string;
  brand: string;
  category: string;
  description: string;
  description_en: string;
  description_kz: string;
  description_zh: string;
  country: string;
  isFeatured: boolean;
  country_en: string;
  country_kz: string;
  country_zh: string;
  link: string;
  photo_link: string;
};

export type UserData = {
  id: string;
  firstName: string;
  lastName: string;
  patronymic: string;
  email: string;
  password: string;
};

export type RecipientOverview = {
  id: string;
  status: RecipientStatus;
  firstName: string;
  lastName: string;
  patronymic: string;
};

export type UserWithRecipientsOverview = {
  user: UserData;
  recipients: RecipientOverview[];
};

export type UserWithRecipientsData = {
  user: UserData;
  recipients: RecipientData[];
};

export type ProfileData = {
  id: string;
  firstName: string;
  lastName: string;
  patronymic: string;
  email: string;
};
