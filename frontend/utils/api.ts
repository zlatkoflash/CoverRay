/**
 * This is server too
 */
"use server"

// export const runtime = 'edge';

import { zconfig } from "@/config/config";
import { createServerSupabase } from "./supabaseServer";
// import { createClient } from "./supabase";
// import { createServerClient } from "@supabase/ssr";
// import { IPageInterface } from "@/app/PagesInterfaces";
// import { zsettings } from "@/settings/ZSettings";
// import { getAccessToken } from "./apiServer";

/**
 * 
 * @param slug 
 * @returns Get api data from the server
 */
export const getApiData = async <T = any>(
  slug: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  data: any = {},
  authorize: "not-authorize" | "authorize" = "not-authorize",
  contentType: "application/json" | "multipart/form-data" = "application/json"
): Promise<T> => {
  let rawData, json: any;


  const supabase = await createServerSupabase();

  // console.log(process.env.WP_APP_PASSWORD);

  const routeURL = zconfig.api.url + slug;

  try {
    // example:
    // rawData = await fetch(zsettings.apiURL + "/get_page_data/home");

    /*const username = process.env.WP_API_USER; // e.g., "admin"
    const appPassword = process.env.WP_APP_PASSWORD; // e.g., "abcd efgh..."
    // const appPassword = "abcd efgh...";
    // 1. Combine and Encode to Base64
    const credentials = `${username}:${appPassword}`;
    const base64Credentials = Buffer.from(credentials).toString('base64');*/

    const base64Credentials = "";

    const options: any = {
      method: method,
      headers: {
        // this auth is for the REST-API, the REST-API must be accesible only from next.js
        // "Authorization": `Basic ${base64Credentials}`
      },


      // This is the magic part for Vercel/Next.js caching
      // link to clear the cache: https://cover-ray.vercel.app/api/cache-clear?token=derkoskiA1&tag=templates
      next: {
        revalidate: false, // Cache for 1 hour (in seconds)
        tags: ['templates'] // Useful for manual cache clearing later
      }
      // credentials: 'include',
      // body: JSON.stringify(data)
    }
    // 🛑 CRITICAL STEP: Add Authorization header if a token is passed
    /*if (authorize === "authorize") {
      const authToken = "";
      // const authToken = await getAccessToken();
      // console.log("authToken:", authToken);
      // Authorization is reserved for api wp password
      // options.headers['Authorization'] = `Bearer ${authToken}`;
      options.headers['X-User-Token'] = `User-Token-Authorization ${authToken}`;
    }*/

    let authToken = null;
    if (authorize === "authorize") {
      // 1. Get the session
      const { data: { session }, error } = await supabase.auth.getSession();

      if (session) {
        authToken = session.access_token;
      } else {
        // 2. If session is null, try to "force" a refresh by getting the user
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Re-run getSession as it might have refreshed now
          const { data: { session: refreshedSession } } = await supabase.auth.getSession();
          authToken = refreshedSession?.access_token;
        }
      }
    }

    // console.log("authorization still don't work good");
    // console.log("authToken:", authToken);

    // console.log("authToken ?? zconfig.supabase.anon:", authToken ?? zconfig.supabase.anon);
    // return;

    const BarrerAuthorization = `Bearer ${authorize === "authorize" ? authToken : zconfig.supabase.anon}`;
    console.log("BarrerAuthorization 222:", BarrerAuthorization);
    options.headers["apikey"] = zconfig.supabase.anon;
    options.headers["Authorization"] = BarrerAuthorization;
    options.headers["X-Client-Info"] = "supabase-js-my-app";

    if (method === "POST") {
      if (contentType === "application/json") {
        options.headers['Content-Type'] = "application/json";
        options.body = JSON.stringify(data);
      } else {
        // options.headers['Content-Type'] = "multipart/form-data";
        options.body = data;
      }
    }
    /*console.log("options for the route:", options);
    console.log("routeURL:", routeURL);
    console.log(zsettings.apiURL, slug);*/
    console.log("routeURL:", routeURL);
    rawData = await fetch(routeURL, options);

    // const text = await rawData.text();console.log("text:", text); //debugging

    try {
      json = await rawData.json();
    }
    catch (error) {
      console.log("error:", error);
      json = {
        ok: false,
        status: 500,
        message: "API route Internal server error 2",
        errorJson500: error
      };
    }

    // console.log("Row json:", json);

    if (["jwt_missing", "jwt_expired", "jwt_invalid", "jwt_revoked", "jwt_user_not_found"].indexOf(json.code as string) !== -1) {
      return {
        ok: false,
        status: 401,
        message: "Unauthorized",
        errorJson401: json
      } as T;
    }
    else if (json.status === 404) {
      return {
        ok: false,
        status: 404,
        message: "API route Not found",
      } as T;
    }
    else if (json.status === 500) {
      return {
        ok: false,
        status: 500,
        message: "API route Internal server error",
        errorJson500: json
      } as T;
    }

    return json;
  }
  catch (error) {
    console.log("Next.js internal 501 error:", error);
    return {
      ok: false,
      status: 501,
      message: "Next.js internal error",
      error: error,
      routeURL: routeURL
    } as T;
  }
}


