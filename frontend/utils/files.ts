import { getApiData } from "./api";
import { createClient } from "./supabase";
// import { supabaseClient } from "./supabase";

/*export const UploadFile_old = async (
  file: File,
  bucket: "photos" | "temporary-photos",
  // the folder must be like: /folder or /folder/folder-inside-2
  folder: string,
  // payload: any,
  authorize: "authorize" | "not-authorize" = "not-authorize",
  details: any = {}
): Promise<{
  ok: boolean,
  uploadFeedback: {
    ok: boolean,
    fileName: string,
    fullPath: string,
    publicUrl: string
  }
}> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("bucket", bucket);
  formData.append("folder", folder);
  // formData.append("payload", JSON.stringify(payload));

 
  const response = await getApiData("/files/upload", "POST", {
    bucket,
    folder,
    type: file.type,
  }, "not-authorize", "application/json")
  
  const responseJSON = await response.json();
  const { uploadUrl, token, publicUrl } = responseJSON;

  console.log("responseJSONA:", responseJSON);

  return response;
}


export const UploadFile = async (
  file: File,
  bucket: "photos" | "temporary-photos",
  folder: string,
  authorize: "authorize" | "not-authorize" = "not-authorize",
  details: any = {}
): Promise<{
  ok: boolean;
  uploadFeedback: {
    ok: boolean;
    fileName: string;
    fullPath: string;
    publicUrl: string;
  };
}> => {

  const supabaseClient = createClient();

  try {
    // 1. Prepare the path (removing leading/trailing slashes to avoid 404s)
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const cleanFolder = folder.replace(/^\/|\/$/g, '');
    const storagePath = cleanFolder ? `${cleanFolder}/${fileName}` : fileName;

    // 2. Upload DIRECTLY to Supabase Storage
    // This handles the stream efficiently and bypasses Edge Function limits
    const { data, error } = await supabaseClient.storage
      .from(bucket)
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) throw error;

    // 3. Get the Public URL
    const { data: { publicUrl } } = supabaseClient.storage
      .from(bucket)
      .getPublicUrl(storagePath);

    return {
      ok: true,
      uploadFeedback: {
        ok: true,
        fileName: fileName,
        fullPath: data.path,
        publicUrl: publicUrl
      }
    };

  } catch (error: any) {
    console.error("Direct Upload Error:", error.message);
    return {
      ok: false,
      uploadFeedback: {
        ok: false,
        fileName: "",
        fullPath: "",
        publicUrl: ""
      }
    };
  }
};*/


export const uploadTempFile = async (
  blob: Blob,
  fileType: 'pdf' | 'png' | 'jpeg',
  existingPath?: string // Optional: pass this to update a specific file
) => {
  const supabase = createClient();

  // 1. Generate a random file name if no existing path is provided
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = fileType === 'pdf' ? 'pdf' : fileType === 'jpeg' ? 'jpg' : 'png';

  // Use the existing path (for updates) or create a new random one
  const filePath = existingPath || `${randomString}.${extension}`;
  console.log("filePath", filePath);

  // 2. Upload / Update (Upsert) the blob
  /*const { data, error } = await supabase.storage
    // .from('temporary-files')
    .from('temporary')
    .upload(filePath, blob, {
      contentType: fileType === 'pdf' ? 'application/pdf' : `image/${fileType}`,
      cacheControl: '3600',
      upsert: true // This allows the "Update" functionality
    });*/
  const { data, error } = await supabase.storage.from('temporary').upload(filePath, blob)
  console.log("data", data);
  console.log("error for:", error);

  if (error) {
    console.error("Upload/Update failed:", error.message);
    return null;
  }

  // 3. Return both the URL and the filePath (so you can update it again later)
  const { data: urlData } = supabase.storage
    .from('temp_uploads')
    .getPublicUrl(filePath);

  return {
    publicUrl: urlData.publicUrl,
    filePath: filePath // Save this in your state to use for the next "Update"
  };
};
