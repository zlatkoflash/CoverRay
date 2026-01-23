export const zconfig: {
  api: {
    url: string,
    /*url_editor: string,
    url_user: string,
    url_payment: string*/
  },
  supabase: {
    url: string,
    anon: string
  },
  stripe: {
    pk: string
  }
} = {
  api: {
    url: process.env.NEXT_PUBLIC_API_URL as string,
    /*url_editor: `${process.env.NEXT_PUBLIC_API_URL}/editor`,
    url_user: `${process.env.NEXT_PUBLIC_API_URL}/user`,
    url_payment: `${process.env.NEXT_PUBLIC_API_URL}/payment`*/
  },
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    anon: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
  },
  stripe: {
    pk: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
  }
};