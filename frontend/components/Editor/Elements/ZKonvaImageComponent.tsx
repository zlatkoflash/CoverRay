import { IKonvaBaseCanvasItem, IKonvaTemplateImageItem } from "@/utils/interfaceTemplate";
import { Image } from "react-konva";
import { useDispatch } from "react-redux";
import * as EditorActions from '@/lib/features/editor/editorSlice';
import useImage from 'use-image';
import { useKonvaElementEvents } from "@/lib/features/editor/editorHooks";

export default function ZKonvaImageComponent({ item, items }: { item: IKonvaTemplateImageItem, items: IKonvaBaseCanvasItem[] }) {

  const itemObjAny = item as any;
  const dispatch = useDispatch();
  const useKonvaGlobalElementEvents = useKonvaElementEvents(item, items);

  const proxiedUrl = `/api/proxy-image?url=${encodeURIComponent(item.src)}`;
  // return null;
  const [loadedImage, status] = useImage(
    // item.src,
    proxiedUrl,
    // "https://nwmttjhoidsujwtxhedu.supabase.co/storage/v1/object/sign/final-products/orders/007bcfb6-b43c-4d51-8710-818c60723276/images/v4dkwrwhgzs.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mNmRmMzY1NC01OWZiLTQ2ZjEtYmE2YS1lMTU3NmM1NGE4YzMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJmaW5hbC1wcm9kdWN0cy9vcmRlcnMvMDA3YmNmYjYtYjQzYy00ZDUxLTg3MTAtODE4YzYwNzIzMjc2L2ltYWdlcy92NGRrd3J3aGd6cy5qcGciLCJpYXQiOjE3Njk4MTM2MDgsImV4cCI6MTc3MDQxODQwOH0.t0IOfm54c9DSbjVY1ipfgVXwg0JMDM9vhZDGwsZKmgo",
    "anonymous"
  );
  if (status !== "loaded" || !loadedImage) {
    return null;
  }


  // console.log("loadedImage:", loadedImage, status);

  // --- Proportional Height Calculation ---
  const fixedWidth = item.width;
  const aspectRatio = loadedImage.height / loadedImage.width;
  const calculatedHeight = fixedWidth * aspectRatio;
  // ----------------------------------------


  return <Image
    key={`item-${item.id}`}
    // id={item.id}
    {...itemObjAny}
    image={loadedImage}
    width={fixedWidth}
    height={calculatedHeight}
    draggable={item.draggable === true}

    scaleX={1}   // Reset scale
    scaleY={1}   // Reset scale
    crop={{ x: 0, y: 0, width: loadedImage.width, height: loadedImage.height }}

    {...useKonvaGlobalElementEvents}
  /*onClick={() => {
    dispatch(EditorActions.setselectedKonvaItem(item));
  }}
  onDragEnd={(e) => {

    const updatedItem = items.find((i: any) => i.id === item.id);
    if (updatedItem) {

      console.log("On Drag end, updatedItem:", updatedItem);
      dispatch(EditorActions.updatePosition(
        {
          id: updatedItem.id,
          x: e.target.x(),
          y: e.target.y()
        }
      ));
    }
  }}*/
  />
}