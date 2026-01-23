/*
Starting command:
npx deno run --allow-net --allow-env --env-file=C:\xampp\htdocs\projects\RicardoRay\supabase\supabase\functions\.env --watch C:\xampp\htdocs\projects\RicardoRay\supabase\supabase\functions\dev-server\index.ts
*/

// dev-server.ts
import { serve } from "https://deno.land/std/http/server.ts";
// import funcA from "../bokun/index.ts";
// import funcB from "../bokun-admin-client/index.ts";
import serverHealth from "./../health/index.ts";
import serverFiles from "./../files/index.ts";
import serverTemplates from "./../templates/index.ts";
import serverStripe from "./../stripe/index.ts";
import serverAuth from "./../auth/index.ts";
import serverOrderPrivate from "../orders-private/index.ts";

serve(async (req: Request) => {
  const url = new URL(req.url);

  console.log('url');

  if (url.pathname.indexOf("/health/") !== -1) return await serverHealth(req);
  else if (url.pathname.indexOf("/files/") !== -1) return await serverFiles(req);
  else if (url.pathname.indexOf("/templates/") !== -1) return await serverTemplates(req);
  else if (url.pathname.indexOf("/stripe/") !== -1) return await serverStripe(req);
  else if (url.pathname.indexOf("/auth/") !== -1) return await serverAuth(req);
  else if (url.pathname.indexOf("/orders-private/") !== -1) return await serverOrderPrivate(req);
  // else if (url.pathname.indexOf("/health/") !== -1) return await funcB(req);
  // else if (url.pathname.indexOf("/payment/") !== -1) return await funcB(req);
  // else if (url.pathname.indexOf("/users/") !== -1) return await funcB(req);

  return new Response("dev-server.ts::Not Found A, path:" + url.pathname, { status: 404 });
});