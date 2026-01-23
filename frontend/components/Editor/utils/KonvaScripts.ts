import { POSTER_H, POSTER_W } from "@/utils/editor";
import { canvasRefs } from "../KonvaStage";
import jsPDF from "jspdf";

/**
 * 
 * @param quality 
 * @param scaleThePoster the poster is POSTER_W x POSTER_H, if scaleThePoster is .5 then the image will be .5x(POSTER_W x POSTER_H)
 * @param view 
 * @returns 
 */
export const GetKonvaBlob = async (

  quality: number = .8,
  scaleThePoster: number = .5,
  view: { x: number, y: number, scale: number },
  generatingType: "generateAsBlob" | "generateAsDataUrl" = "generateAsBlob"

): Promise<{ url: string, blob?: Blob, dataUrl?: string } | null> => {
  console.log("GetKonvaBlob():");
  console.log("canvasRefs.pageGroup:", "checking if it is there...");
  if (!canvasRefs.pageGroup) return null;
  console.log("canvasRefs.pageGroup:", "is there");
  const group = canvasRefs.pageGroup;
  const stage = group?.getStage(); // Get the stage reference
  console.log("canvasRefs.pageGroup:", "is there");

  console.log("group:", "checking if it is there...");
  if (!group || !stage) return null;
  console.log("group:", "is there");

  const transform = group.getAbsoluteTransform().getTranslation();
  /**
   * Now we make transformRef invisible, so it will not draw the border in the generated images
   */
  canvasRefs.transformRef?.visible(false);

  // return null;
  const details = await new Promise<{ url: string, blob?: Blob, dataUrl?: string } | null>((resolve, reject) => {
    const thumbnailRatio = scaleThePoster / view.scale; // 1/3 of 300DPI size

    const detailsForThePoster = {
      mimeType: 'image/jpeg',
      // quality: 0.8, // Slightly lower quality for faster DB storage
      quality,
      pixelRatio: thumbnailRatio,
      x: transform.x,
      y: transform.y,
      width: POSTER_W * view.scale,
      height: POSTER_H * view.scale,
    };

    if (generatingType === "generateAsBlob")
      stage.toBlob({
        callback: (blob: Blob | null) => {
          if (!blob) {
            reject(null);
            return null;
          }
          const url = URL.createObjectURL(blob);
          resolve({ url, blob });
        },
        /*mimeType: 'image/jpeg',
        // quality: 0.8, // Slightly lower quality for faster DB storage
        quality,
        pixelRatio: thumbnailRatio,
        x: transform.x,
        y: transform.y,
        width: POSTER_W * view.scale,
        height: POSTER_H * view.scale,*/
        ...detailsForThePoster
      });
    else if (generatingType === "generateAsDataUrl")
      stage.toDataURL({
        callback: (dataUrl: string) => {
          resolve({ url: dataUrl, dataUrl: dataUrl });
        },
        ...detailsForThePoster
      });
  });

  /**
   * Now we make again transformRef visible 
   */
  canvasRefs.transformRef?.visible(true);

  return details;
}


export const getKonvaPDF = async (imageDataURL: string, view: { x: number, y: number, scale: number }, scale: number = 1.4): Promise<jsPDF> => {

  // const w = POSTER_W * view.scale;
  // const h = POSTER_H * view.scale;
  const w = POSTER_W * scale;
  const h = POSTER_H * scale;
  console.log("w", w);
  console.log("h", h);
  const doc = new jsPDF(
    {
      orientation: "p",
      unit: "px",
      format: [w, h]
    }
  );
  doc.addImage(imageDataURL, "JPEG", 0, 0, w, h);
  return doc;
}