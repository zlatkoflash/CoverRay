import { serve } from "https://deno.land/std@0.210.0/http/server.ts";
import { ZFiles } from "../_libs/ZFiles.ts";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

export default async function handler(req: Request): Promise<Response> {

  // getting the post data
  let payload: any = {};
  let formData: any = {};

  const contentType = req.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    try {
      payload = await req.json();
    }
    catch (e) { }
    console.log("payload:", payload);
  }

  if (contentType.includes("multipart/form-data")) {
    // 🟢 Use req.formData()
    try {
      formData = await req.formData();
    }
    catch (e) { }
    /*const file = form.get("file");
    return new Response(`Received File: ${file?.name}`);*/
  }

  console.log("formData:", formData);



  const zfiles = new ZFiles();

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

    console.log("formData before switch:", formData);
    console.log("formData file before switch:", formData.file);

    switch (subSlug) {
      /*
      supabase edge functions can't upload big files, upload direct to supabase for those purposes
      case 'upload':
        const uploadFeedback =
          
          console.log("payload2:", payload);
        await zfiles.getUploadUrl(
          payload.bucket,
          payload.folder,
          payload.type
        );
        responseBody = { ok: true, subSlug: subSlug, uploadFeedback };
        status = 200;
        break;*/
      case "":
        responseBody = { ok: true, subSlug: subSlug };
        status = 200;
        break;
    }


    // return new Response(JSON.stringify(responseBody), { status: status });
    return new Response(
      JSON.stringify(responseBody),
      {
        status: status,
        headers: { ...cors, "Content-Type": "application/json" }
      },
    );

  }
  catch (error: any) {
    console.error(error);
    return new Response(error.message, { status: 500 });
  }


}


if (import.meta.main) {
  serve(handler);
}