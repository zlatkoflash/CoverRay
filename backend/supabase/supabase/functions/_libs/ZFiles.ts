export class ZFiles {
  public static zfiles: ZFiles = new ZFiles();

  /**
   * Uploads a file to Supabase Storage with a generated random path.
   * // for big images don't work
   */
  public async uploadFile_error_for_deleting(
    bucket: "photos" | "temporary-photos",
    folder: string, // e.g., "/raw-uploads"
    file: File | Blob
  ) {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase environment variables");
    }

    const randomName = crypto.randomUUID();
    const extension = file.type.split("/")[1] || "bin";
    const generatedPath = `${randomName}.${extension}`;

    // Ensure folder has leading slash if missing, and remove trailing slash
    const cleanFolder = folder.startsWith("/") ? folder : `/${folder}`;

    // Final path inside the bucket
    const storagePath = `${cleanFolder}/${generatedPath}`.replace(/\/+/g, '/').replace(/^\//, '');

    const url = `${supabaseUrl}/storage/v1/object/${bucket}/${storagePath}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${supabaseServiceKey}`,
          "x-upsert": "true",
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${response.status} - ${errorText}`);
      }

      const result = await response.json();

      // Generate the Absolute Public URL
      const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${storagePath}`;

      return {
        ok: true,
        data: result,
        fileName: generatedPath,
        fullPath: `${bucket}/${storagePath}`,
        publicUrl: publicUrl // This is your absolute image path
      };

    } catch (error) {
      console.error("Internal Function Upload Error:", error);
      return {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }


  /**
   * 
   * @param bucket 
   * @param folder 
   * @param fileType 
   * @returns 
   * this supabase function will return the url for uploading the photo from the frontend
   */
  public async getUploadUrl_error_for_deleting(bucket: string, folder: string, fileType: string) {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")?.replace(/\/$/, "");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    const randomName = crypto.randomUUID();
    const extension = fileType.split("/")[1] || "bin";
    const storagePath = `${folder}/${randomName}.${extension}`.replace(/\/+/g, '/').replace(/^\//, '');

    // FIX: Use the 'signed-upload-url' endpoint instead of 'upload/sign'
    // This endpoint is much more stable for direct PUT uploads
    const fetchURL = `${supabaseUrl}/storage/v1/object/signed-upload-url/${bucket}/${storagePath}`;

    const res = await fetch(fetchURL, {
      method: "POST", // We POST to generate the URL
      headers: {
        "Authorization": `Bearer ${supabaseServiceKey}`,
        "Content-Type": "application/json",
      },
      // Note: This endpoint doesn't need 'path' in body because it's in the URL
      body: JSON.stringify({ expiresIn: 3600 }),
    });

    const result = await res.json();

    if (!res.ok) {
      console.error("Supabase Error Details:", result);
      throw new Error(`Storage error: ${result.message || 'Unknown'}`);
    }

    // result.url will be the full signed URL including the token
    return {
      uploadUrl: result.url,
      publicUrl: `${supabaseUrl}/storage/v1/object/public/${bucket}/${storagePath}`
    };
  }

}