export interface IBCProductVariation {
  id: number;
  product_id: number;
  sku: string;
  sku_id: number | null;
  price: number;
  calculated_price: number;
  sale_price: number;
  retail_price: number;
  map_price: number;
  fixed_cost_shipping_price: number;
  cost_price: number;
  weight: number;
  width: number;
  height: number;
  depth: number;
  is_free_shipping: boolean;
  calculated_weight: number;
  purchasing_disabled: boolean;
  purchasing_disabled_message: string;
  image_url: string;
  upc: string;
  mpn: string;
  gtin: string;
  inventory_level: number;
  inventory_warning_level: number;
  bin_picking_number: string;
  option_values: IBCCartOptionValue[]; // Consider defining a specific interface for options if they have a set structure
}

export interface IBCCartItem {
  id: string;
  parent_id: string | null;
  variant_id: number;
  product_id: number;
  sku: string;
  name: string;
  url: string;
  quantity: number;
  taxable: boolean;
  image_url: string;
  discounts: any[];
  coupons: any[];
  discount_amount: number;
  coupon_amount: number;
  original_price: number;
  list_price: number;
  sale_price: number;
  extended_list_price: number;
  extended_sale_price: number;
  is_require_shipping: boolean;
  is_mutable: boolean;
  is_custom_price: boolean;
  added_by_promotion: boolean;

  options?: Array<{
    display_name: string; // e.g., "Size"
    label: string;        // e.g., "L"
  }>;

}

export interface IBigCommerceCart {

  id: string;
  customer_id: number;
  channel_id: number;
  email: string;
  currency: {
    code: string;
  };
  tax_included: boolean;
  base_amount: number;
  discount_amount: number;
  manual_discount_amount: number;
  cart_amount: number;
  coupons: Array<{
    code: string;
    id: string;
    coupon_type: string;
    discounted_amount: number;
  }>;
  discounts: Array<{
    id: string;
    discounted_amount: number;
  }>;
  line_items: {
    physical_items: IBCCartItem[];
    digital_items: IBCCartItem[];
    gift_certificates: any[];
    custom_items: any[];
  };
  created_time: string;
  updated_time: string;
  locale: string;
  version: number;
  redirect_urls: {
    cart_url: string;
    checkout_url: string;
    embedded_checkout_url: string;
  };
}




export interface IBigCommerceProduct {
  id: number;
  name: string;
  type: "physical" | "digital";
  sku: string;
  description: string;
  weight: number;
  width: number;
  depth: number;
  height: number;
  price: number;
  cost_price: number;
  retail_price: number;
  sale_price: number;
  map_price: number;
  tax_class_id: number;
  product_tax_code: string;
  calculated_price: number;
  categories: number[];
  brand_id: number;
  option_set_id: number;
  option_set_display: string;
  inventory_level: number;
  inventory_warning_level: number;
  inventory_tracking: "none" | "product" | "variant";
  reviews_rating_sum: number;
  reviews_count: number;
  total_sold: number;
  fixed_cost_shipping_price: number;
  is_free_shipping: boolean;
  is_visible: boolean;
  is_featured: boolean;
  related_products: number[];
  warranty: string;
  bin_picking_number: string;
  layout_file: string;
  upc: string;
  mpn: string;
  gtin: string;
  date_last_imported: string | null;
  search_keywords: string;
  availability: "available" | "disabled" | "preorder";
  availability_description: string;
  gift_wrapping_options_type: string;
  gift_wrapping_options_list: any[];
  sort_order: number;
  condition: "New" | "Used" | "Refurbished";
  is_condition_shown: boolean;
  order_quantity_minimum: number;
  order_quantity_maximum: number;
  page_title: string;
  meta_keywords: string[];
  meta_description: string;
  date_created: string;
  date_modified: string;
  view_count: number;
  preorder_release_date: string | null;
  preorder_message: string;
  is_preorder_only: boolean;
  is_price_hidden: boolean;
  price_hidden_label: string;
  custom_url: {
    url: string;
    is_customized: boolean;
  };
  base_variant_id: number | null;
  open_graph_type: string;
  open_graph_title: string;
  open_graph_description: string;
  open_graph_use_meta_description: boolean;
  open_graph_use_product_name: boolean;
  open_graph_use_image: boolean;
  /*variants: Array<{
    id: number;
    product_id: number;
    sku: string;
    sku_id: number;
    price: number | null;
    calculated_price: number;
    sale_price: number | null;
    retail_price: number | null;
    map_price: number | null;
    fixed_cost_shipping_price: number | null;
    cost_price: number;
    weight: number | null;
    width: number | null;
    height: number | null;
    depth: number | null;
    is_free_shipping: boolean;
    calculated_weight: number;
    purchasing_disabled: boolean;
    purchasing_disabled_message: string;
    image_url: string;
    upc: string;
    mpn: string;
    gtin: string;
    inventory_level: number;
    inventory_warning_level: number;
    bin_picking_number: string;
    option_values: Array<{
      id: number;
      label: string;
      option_id: number;
      option_display_name: string;
    }>;
  }>;*/
  variants: IBCProductVariation[];
}


/*export interface IBCCartVariant {
  id: number;
  product_id: number;
  sku: string;
  sku_id: number | null;
  price: number;
  calculated_price: number;
  sale_price: number | null;
  retail_price: number | null;
  map_price: number | null;
  fixed_cost_shipping_price: number | null;
  cost_price: number;
  weight: number | null;
  width: number | null;
  height: number | null;
  depth: number | null;
  is_free_shipping: boolean;
  calculated_weight: number;
  purchasing_disabled: boolean;
  purchasing_disabled_message: string;
  image_url: string;
  upc: string;
  mpn: string;
  gtin: string;
  inventory_level: number;
  inventory_warning_level: number;
  bin_picking_number: string;
  option_values: IBCCartOptionValue[];
}*/

export interface IBCCartOptionValue {
  id: number;
  label: string;                // e.g., "Black Matted Frame"
  option_id: number;
  option_display_name: string;  // e.g., "Frame"
}



export interface IBCCustomer {
  id: number;
  authentication: {
    force_password_reset: boolean;
    // Note: new_password is only present in POST/PUT requests, 
    // it won't be returned in GET responses for security.
    new_password?: string;
  };
  company: string;
  customer_group_id: number;
  email: string;
  first_name: string;
  last_name: string;
  notes: string;
  phone: string;
  registration_ip_address: string;
  tax_exempt_category: string;
  date_created: string; // ISO 8601 format
  date_modified: string; // ISO 8601 format
  accepts_product_review_abandoned_cart_emails: boolean;
  origin_channel_id: number;
  channel_ids: number[] | null;
}