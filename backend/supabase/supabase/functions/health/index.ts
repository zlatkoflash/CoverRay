import { serve } from "https://deno.land/std@0.210.0/http/server.ts";

export default async function handler(req: Request): Promise<Response> {

  // getting the post data
  let payload: any = {};
  try {
    payload = await req.json();
  }
  catch (e) { }

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
      case 'test':
        responseBody = { message: "OK", subSlug: subSlug };
        status = 200;
        break;
      case "":
        responseBody = { message: "OK", subSlug: subSlug };
        status = 200;
        break;
    }


    return new Response(JSON.stringify(responseBody), { status: status });

  }
  catch (error: any) {
    console.error(error);
    return new Response(error.message, { status: 500 });
  }


}


if (import.meta.main) {
  serve(handler);
}