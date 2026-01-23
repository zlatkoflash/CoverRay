/**
 * 
 * Don't modify here the interfaces, 
 * they are generated from the supabase function _libs/InterfacesStripe.ts
 */
export interface IStripePrice {
  id: string;
  object: 'price';
  active: boolean;
  billing_scheme: string;
  created: number;
  currency: string;
  livemode: boolean;
  type: 'one_time' | 'recurring';
  unit_amount: number; // Amount in cents (e.g., 6495)
  unit_amount_decimal: string;
  metadata: Record<string, any>;
  [key: string]: any; // For other optional fields like recurring, tax_behavior
}

export interface IStripeProductMetadata {
  group?: 'main-products' | 'shipping' | string;
  icon?: string;
  compare_at_price?: string;
  requires_shipping?: string;
  original_price?: number;
  [key: string]: any;
}

export interface IStripeProduct {
  id: string;
  object: 'product';
  active: boolean;
  name: string;
  description: string | null;
  images: string[];
  created: number;
  updated: number;
  livemode: boolean;
  type: string;
  package_dimensions: any | null;
  shippable: boolean | null;
  metadata: IStripeProductMetadata;
  // This matches your 'expand' logic where default_price is an object, not just a string
  default_price: IStripePrice;
  tax_code: string | null;
  url: string | null;
}




export interface IStripeCustomer {
  id: string;
  object: "customer";
  address: string | null;
  balance: number;
  created: number; // Unix timestamp
  currency: string | null;
  customer_account: string | null;
  default_source: string | null;
  delinquent: boolean;
  description: string | null;
  discount: any | null;
  email: string;
  invoice_prefix: string;
  invoice_settings: {
    custom_fields: any[] | null;
    default_payment_method: string | null;
    footer: string | null;
    rendering_options: any | null;
  };
  livemode: boolean;
  metadata: Record<string, any>;
  name: string | null;
  next_invoice_sequence: number;
  phone: string | null;
  preferred_locales: string[];
  shipping: any | null;
  tax_exempt: "none" | "exempt" | "reverse";
  test_clock: any | null;
}



export interface IStripePaymentMethod {
  id: string; // "pm_1Ss482A8..."
  object: "payment_method";
  allow_redisplay: "unspecified" | "always" | "limited";
  billing_details: {
    address: {
      city: string | null;
      country: string | null;
      line1: string | null;
      line2: string | null;
      postal_code: string | null;
      state: string | null;
    };
    email: string | null;
    name: string | null;
    phone: string | null;
    tax_id: string | null;
  };
  card: {
    brand: string; // e.g., "visa"
    checks: {
      address_line1_check: any | null;
      address_postal_code_check: any | null;
      cvc_check: any | null;
    };
    country: string; // e.g., "US"
    display_brand: string;
    exp_month: number;
    exp_year: number;
    funding: "credit" | "debit" | "prepaid" | "unknown";
    generated_from: any | null;
    last4: string;
    networks: {
      available: string[];
      preferred: string | null;
    };
    regulated_status: string;
    three_d_secure_usage: {
      supported: boolean;
    };
    wallet: any | null;
  };
  created: number; // Unix timestamp
  customer: string | null;
  customer_account: string | null;
  livemode: boolean;
  radar_options: Record<string, any>;
  type: "card";
}






export interface IStripePaymentIntent {
  id: string; // "pi_3Ss6cX..."
  object: "payment_intent";
  amount: number; // e.g., 1500 for $15.00
  amount_capturable: number;
  amount_details: {
    tip: Record<string, any>;
  };
  amount_received: number;
  application: string | null;
  application_fee_amount: number | null;
  automatic_payment_methods: {
    allow_redirects: "never" | "always";
    enabled: boolean;
  };
  canceled_at: number | null;
  cancellation_reason: string | null;
  capture_method: "automatic" | "manual";
  client_secret: string; // Used on frontend for 3D Secure
  confirmation_method: "automatic" | "manual";
  created: number; // Unix timestamp
  currency: string; // "usd"
  customer: string; // "cus_TpjRE..."
  customer_account: string | null;
  description: string | null;
  excluded_payment_method_types: string[] | null;
  invoice: string | null;
  last_payment_error: any | null;
  latest_charge: string; // "ch_..."
  livemode: boolean;
  metadata: {
    product_ids: string;
    total_items: string;
    [key: string]: string; // Allows for other dynamic metadata
  };
  next_action: any | null; // Crucial for 3D Secure handling
  on_behalf_of: string | null;
  payment_method: string; // "pm_..."
  payment_method_configuration_details: {
    id: string;
    parent: string | null;
  };
  payment_method_options: {
    card: {
      installments: any | null;
      mandate_options: any | null;
      network: any | null;
      request_three_d_secure: "automatic" | "any" | "challenge_only";
    };
    link: {
      persistent_token: any | null;
    };
  };
  payment_method_types: string[]; // ["card", "link"]
  processing: any | null;
  receipt_email: string | null;
  review: any | null;
  setup_future_usage: "off_session" | "on_session" | null;
  shipping: any | null;
  source: any | null;
  statement_descriptor: string | null;
  statement_descriptor_suffix: string | null;
  status: "succeeded" | "requires_action" | "requires_payment_method" | "processing" | "canceled";
  transfer_data: any | null;
  transfer_group: any | null;
}