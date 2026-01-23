import { serve } from "https://deno.land/std@0.210.0/http/server.ts";
import { ZAuth } from "../_libs/ZAuth.ts";
import { ZOrder } from "../_libs/Order/ZOrder.ts";
// import { ZAuth } from "../_libs/ZAuth.ts";
// import { ZTemplates } from "../_libs/ZTemplates.ts";
// import { createEdgeSupabaseClient } from "../_config/supabase.ts";
// import { ZStripe } from "../_libs/Stripe/ZStripe.ts";
// import { ZFiles } from "../_libs/ZFiles.ts";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

export default async function handler(req: Request): Promise<Response> {
  //const supabaseClient = createEdgeSupabaseClient(req);
  // const templates = new ZTemplates(supabaseClient);

  const zauth = new ZAuth();

  let user = await zauth.authorizeForPrivateRoutes(req);

  // user = null;
  if (user === null) {
    return new Response(JSON.stringify({
      ok: false,
      message: "Unauthorized"
    }), { headers: cors, status: 401 });
  }

  const zorder = new ZOrder();


  let payload: any = {};
  try {
    payload = await req.json();
  }
  catch (e) { }
  console.log("payload:", payload);





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
      case "health":
        status = 200;
        responseBody = { ok: true, user: user };
        break;
      case "create-the-order":
        /*status = 200;
        const detailsAfterSignIn = await zauth.login(payload);
        responseBody = {
          // ok: true,
          ...detailsAfterSignIn
        }*/
        const detailsAfterCreatingTheOrder = await zorder.createOrder(user, payload);
        status = 200;
        responseBody = {
          ok: true,
          ...detailsAfterCreatingTheOrder
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