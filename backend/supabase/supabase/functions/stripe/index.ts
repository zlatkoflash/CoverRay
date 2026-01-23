import { serve } from "https://deno.land/std@0.210.0/http/server.ts";
import { ZTemplates } from "../_libs/ZTemplates.ts";
import { createEdgeSupabaseClient } from "../_config/supabase.ts";
import { ZStripe } from "../_libs/Stripe/ZStripe.ts";
// import { ZFiles } from "../_libs/ZFiles.ts";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

export default async function handler(req: Request): Promise<Response> {
  //const supabaseClient = createEdgeSupabaseClient(req);
  // const templates = new ZTemplates(supabaseClient);

  let payload: any = {};
  try {
    payload = await req.json();
  }
  catch (e) { }
  console.log("payload:", payload);

  const zstripe = new ZStripe();



  const url = new URL(req.url);
  const pathSegments = url.pathname.split('/').filter(segment => segment.length > 0);

  let subSlug = '';
  if (pathSegments.length > 1) {
    subSlug = pathSegments[1];
  }

  try {
    let responseBody: any = { message: "Unknown endpoint." };
    let status = 404;


    switch (subSlug) {
      case "get-products":
        status = 200;
        const products = await zstripe.getProducts();
        responseBody = {
          ok: true,
          products
        }
        break;

      case "get-stripe-customer":
        status = 200;
        const email = payload.email;
        const stripeCustomer = await zstripe.getStripeCustomer(email);
        responseBody = {
          ok: true,
          stripeCustomer
        }
        break;

      case "create-payment-intent":
        status = 200;
        const paymentIntentData = await zstripe.doPaymentIntent(payload);
        responseBody = {
          ok: paymentIntentData.error !== true,
          message: paymentIntentData.message,
          paymentIntentData
        }
        break;
    }
    return new Response(JSON.stringify(responseBody), { headers: cors, status });
  }
  catch (e: any) {
    console.error(e);
    return new Response(e.message, { headers: cors, status: 500 });
  }

}


if (import.meta.main) {
  serve(handler);
}