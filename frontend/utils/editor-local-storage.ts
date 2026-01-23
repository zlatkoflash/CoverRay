import { set, get } from "idb-keyval";
import { ITemplate } from "./interfaceDatabase";
import { IEditedTemplateForSave } from "@/lib/features/editor/editorSlice";

export const LS_KEY_PERSON_TYPE = "person_type";
export const LS_KEY_OCCATION_TYPE = "occation_type";
export const LS_KEY_IMAGE_URL = "image_url";
export const LS_KEY_TEMPLATE_ID = "template_id";
export const INDEX_DB_IMAGE_REF = "index_db_image_ref";
export const INDEX_DB_TEMPLATE_EDITED_REF_ = "index_db_template_edited_ref_";
export const INDEX_DB_TEMPLATE_REF_FOR_PAYMENT = "ref-save-for-payment";
export const INDEX_DB_TEMPLATE_COVER_FINAL_FOR_PAYMENT = "index_db_template_cover_final_for_payment";
export const INDEX_DB_TEMPLATE_PDF_FINAL_FOR_PAYMENT = "index_db_template_pdf_final_for_payment";

export const LS_SaveData = (key: string, value: string) => {
  localStorage.setItem(key, value);
}

export const LS_GetData = (key: string) => {
  return localStorage.getItem(key);
}



/**
 * For saving data and images I will use:
 * idb-keyval for single storing template and image
 * Dexie.js for multiple storing templates and images
 * those 2 libraries are storing the data in IndexedDB that is the same as localStorage but it is faster and it is not limited by the size of the data,
 * IndexedDB actually is browser database that is not limited by the size of the data and it is not limited by the number of the data
 */


/**
 * Saves a File object into IndexedDB using idb-keyval
 * @param file - The image file to store
 */
export const LS_SaveImageIntoIndexDB = async (file: File | Blob, template_slug: string = ""): Promise<string> => {
  // We create a unique key for this specific image
  // const INDEX_DB_IMAGE_REF = `img_${file.name}_${Date.now()}`;

  const finalIndexRefForIndexDB = `${INDEX_DB_IMAGE_REF}${template_slug !== "" ? `_${template_slug}` : ""}`;

  try {
    // idb-keyval handles the binary File object automatically
    await set(finalIndexRefForIndexDB, file);

    console.log(`Image saved successfully under key: ${finalIndexRefForIndexDB}`);
    return finalIndexRefForIndexDB;
  } catch (error) {
    console.error("Error saving image to idb-keyval:", error);
    throw error;
  }
};

/**
 * Retrieves the stored image and creates a temporary URL
 */
export const LS_GetImageURL = async (template_slug: string = ""): Promise<string | null> => {

  const finalIndexRefForIndexDB = `${INDEX_DB_IMAGE_REF}${template_slug !== "" ? `_${template_slug}` : ""}`;

  try {
    const file = await get(finalIndexRefForIndexDB);

    if (file instanceof Blob) {
      // This creates a URL like "blob:http://localhost:3000/..."
      return URL.createObjectURL(file);
    }

    return null;
  } catch (error) {
    console.error("Failed to retrieve image:", error);
    return null;
  }
};


/**
 * 
 * @param editedTemplate 
 * @param custom_ref 
 * @returns 
 * This function save the templates
 */
export const LS_SaveTemplateIntoIndexDB = async (
  /*template_slug: string,
  edited_template_items: any,
  image_url: string,
  template: ITemplate,*/
  editedTemplate: IEditedTemplateForSave,
  custom_ref: string = "",
  // currentCoverImageURL: string,
): Promise<string> => {

  console.log("editedTemplate for saving:", editedTemplate);

  const finalIndexRefForIndexDB = `${INDEX_DB_TEMPLATE_EDITED_REF_}${custom_ref !== "" ? custom_ref : editedTemplate.template.slug}`;
  // if (custom_ref !== "") finalIndexRefForIndexDB = custom_ref;

  try {

    const blobResponse = await fetch(editedTemplate.coverImageURL);
    const blob = await blobResponse.blob();
    await LS_SaveImageIntoIndexDB(blob, `${finalIndexRefForIndexDB}_cover`);

    if (editedTemplate.thumbnailDataUrl) {
      const blobResponse = await fetch(editedTemplate.thumbnailDataUrl);
      const blob = await blobResponse.blob();
      await LS_SaveImageIntoIndexDB(blob, `${finalIndexRefForIndexDB}_thumbnail`);
    }

    await set(finalIndexRefForIndexDB, editedTemplate);
    console.log(`Template saved successfully under key: ${finalIndexRefForIndexDB}`);
    return finalIndexRefForIndexDB;
  } catch (error) {
    console.error("Error saving template to idb-keyval:", error);
    throw error;
  }
};
export const LS_GetTemplateFromIndexDB = async (template_slug: string = ""): Promise<IEditedTemplateForSave | null> => {

  const finalIndexRefForIndexDB = `${INDEX_DB_TEMPLATE_EDITED_REF_}${template_slug}`;

  try {
    const template = await get(finalIndexRefForIndexDB);
    const coverImageURL = await LS_GetImageURL(`${finalIndexRefForIndexDB}_cover`);
    const thumbnailDataUrl = await LS_GetImageURL(`${finalIndexRefForIndexDB}_thumbnail`);

    if (template !== null && coverImageURL !== null) {
      return { ...template as IEditedTemplateForSave, coverImageURL, thumbnailDataUrl };
    }
    return null;
  } catch (error) {
    console.error("Failed to retrieve template:", error);
    return null;
  }
};



export const LS_SaveBlobIntoIndexDB = async (blob: Blob, key: string): Promise<string> => {
  try {
    await set(key, blob);
    console.log(`Blob saved successfully under key: ${key}`);
    return key;
  } catch (error) {
    console.error("Error saving blob to idb-keyval:", error);
    throw error;
  }
}
export const LS_GetBlobFromIndexDB = async (key: string): Promise<Blob | null> => {
  try {
    const blob = await get(key);
    if (blob instanceof Blob) {
      return blob;
    }
    return null;
  } catch (error) {
    console.error("Failed to retrieve blob:", error);
    return null;
  }
}

export const LS_SaveCoverAndPDF_ForFinalPayment = async (
  coverImageBlob: Blob,
  pdfBlob: Blob,
): Promise<{ coverImageRef: string, pdfRef: string }> => {

  const coverImageRef = await LS_SaveBlobIntoIndexDB(coverImageBlob, INDEX_DB_TEMPLATE_COVER_FINAL_FOR_PAYMENT);
  const pdfRef = await LS_SaveBlobIntoIndexDB(pdfBlob, INDEX_DB_TEMPLATE_PDF_FINAL_FOR_PAYMENT);

  return { coverImageRef, pdfRef };
}