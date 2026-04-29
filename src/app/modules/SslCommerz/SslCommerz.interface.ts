export interface ISslCommerzRequest {
  store_id: string;
  store_passwd: string;
  total_amount: number;
  currency: string;
  tran_id: string;
  product_category: string;
  product_name: string;
  success_url: string;
  fail_url: string;
  cancel_url: string;
  ipn_url: string;
  cus_name: string;
  cus_email: string;
  cus_add1: string;
  cus_city: string;
  cus_state: string;
  cus_postcode: string;
  cus_country: string;
  cus_phone: string;
  ship_name: string;
  ship_add1: string;
  ship_city: string;
  ship_state: string;
  ship_postcode: string;
  ship_country: string;
  multi_card_name: string;
}

export interface ISslCommerzShipping {
  name: string;
  streetAddress: string;
  city: string;
  district: string;
  postcode?: string;
}

export interface ISslCommerzInit {
  amount: number;
  transactionId: string;
  name: string;
  email: string;
  streetAddress: string;
  city: string;
  district: string;
  postcode?: string;
  phone: string;
  /** Separate shipping address — used for ship_* fields when customer ships to a different address */
  shipping?: ISslCommerzShipping;
}
