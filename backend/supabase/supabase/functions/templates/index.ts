import { serve } from "https://deno.land/std@0.210.0/http/server.ts";
import { ZTemplates } from "../_libs/ZTemplates.ts";
import { createEdgeSupabaseClient } from "../_config/supabase.ts";
// import { ZFiles } from "../_libs/ZFiles.ts";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

export default async function handler(req: Request): Promise<Response> {

  const supabaseClient = createEdgeSupabaseClient(req);
  const templates = new ZTemplates(supabaseClient);

  let payload: any = {};
  try {
    payload = await req.json();
  }
  catch (e) { }
  console.log("payload:", payload);


  const url = new URL(req.url);
  const pathSegments = url.pathname.split('/').filter(segment => segment.length > 0);

  // The path segments look like: ["functions", "v1", "my-function", "sub-slug", "id"]
  // We want the segments *after* the function name ("my-function").
  // If the function is deployed under /v1/my-function, the routable part starts at index 3.
  /*const routableSegments = pathSegments.slice(3);
  const subSlug = routableSegments[0]; // e.g., "info" or "calculate"
  console.log("pathSegments:", pathSegments);
  console.log("routableSegments:", routableSegments);*/
  let subSlug = '';
  if (pathSegments.length > 1) {
    subSlug = pathSegments[1];
  }

  try {
    let responseBody: any = { message: "Unknown endpoint." };
    let status = 404;


    switch (subSlug) {
      case "get-categories":
        const categoriesData = await templates.getCategoriesData();
        responseBody = {
          ok: true,
          categories: categoriesData
        };
        status = 200;
        break;
      case "get-templates":
        console.log(payload);
        const templatesData = await templates.getTemplatesData(payload.category_id);
        responseBody = {
          ok: true,
          templates: templatesData
        };
        status = 200;
        break;

      case "get-template-by-slug":
        console.log(payload);
        const templateData = await templates.getTemplateBySlug(payload.template_slug);
        responseBody = {
          ok: true,
          template: templateData
        };
        status = 200;
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