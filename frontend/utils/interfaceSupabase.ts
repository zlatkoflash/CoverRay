/**
 * This interfaces are for supabase auth
 */

export interface ISupabaseUser {
  id: string;
  aud: string;
  role: string;
  email: string;
  email_confirmed_at: string;
  phone: string;
  confirmed_at: string;
  last_sign_in_at: string;
  app_metadata: IAppMetadata;
  user_metadata: IUserMetadata;
  identities: IUserIdentity[];
  created_at: string;
  updated_at: string;
  is_anonymous: boolean;
}

interface IAppMetadata {
  provider: string;
  providers: string[];
}

interface IUserMetadata {
  email_verified: boolean;
  role: string;
  signup_date: string;
}

interface IUserIdentity {
  identity_id: string;
  id: string;
  user_id: string;
  identity_data: IIdentityData;
  provider: string;
  last_sign_in_at: string;
  created_at: string;
  updated_at: string;
  email: string;
}

interface IIdentityData {
  email: string;
  email_verified: boolean;
  phone_verified: boolean;
  sub: string;
}



