export interface ITemplateCategory {
  /** * Primary Key: Uses 'number' to match PostgreSQL bigint 
   */
  id: number;

  /** * timestamp with time zone (ISO String format) 
   */
  created_at: string;

  /** * text null (optional or nullable)
   */
  label: string | null;

  /** * text null (optional or nullable)
   * Usually stores a Lucide icon name or a URL string
   */
  icon: string | null;
}

export interface ITemplateCategoryWithCount extends ITemplateCategory {
  template_count: number;
}




export interface ITemplate {
  id: string; // uuid
  name: string;
  slug: string;
  category: string; // The text/slug category from your table
  thumbnail_url: string | null;
  template_data: Record<string, any>; // maps to jsonb
  is_active: boolean;
  sort_order: number;
  created_at: string; // ISO timestamp
  updated_at: string;
}



export interface IProfile {
  /** The unique ID matching the auth.users table */
  id: string;

  /** User's email address */
  email: string | null;

  /** User's phone number */
  phone: string | null;

  /** The name shown in the UI (e.g., "John Doe") */
  display_name: string | null;

  /** ISO String of when the account was created */
  created_at: string | null;

  /** ISO String of the most recent login */
  last_login_at: string | null;

  /** * ISO String for data retention policy. 
   * Defaults to 1 year from now.
   */
  retention_expires_at: string | null;
}



/**
 * Represents a record from the public.orders table.
 */
export interface IOrder {
  // Primary Key
  id: string; // uuid, default: gen_random_uuid()

  // Foreign Keys & Relations
  user_id: string | null; // references profiles(id), nullable
  template_id: string | null; // uuid, nullable

  // Stripe Integration
  stripe_payment_intent_id: string | null;
  stripe_checkout_session_id: string | null; // indexed

  // Financials
  amount: number; // numeric(10, 2)
  currency: string | null; // default: 'usd'

  // Status with restricted string literal types based on CHECK constraint
  status: 'pending' | 'completed' | 'failed' | 'refunded'; // default: 'pending'

  // Digital Asset Info
  download_url: string | null;
  download_count: number | null; // default: 0

  // Flexible Metadata
  metadata: Record<string, any> | null; // jsonb, default: {}

  // Timestamps
  created_at: string | Date | null; // timestamptz, default: now()
  updated_at: string | Date | null; // timestamptz, updated via trigger
}