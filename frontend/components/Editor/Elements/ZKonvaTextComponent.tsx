import { IKonvaBaseCanvasItem, IKonvaTemplateTextItem } from '@/utils/interfaceTemplate';
import { Text } from 'react-konva';
import { useDispatch } from 'react-redux';
import * as EditorActions from '@/lib/features/editor/editorSlice';
import { useKonvaElementEvents } from '@/lib/features/editor/editorHooks';

export default function ZKonvaTextComponent({ item, items }: { item: IKonvaTemplateTextItem, items: IKonvaBaseCanvasItem[] }) {

  const dispatch = useDispatch();
  // const EditorActions = u
  const itemObjAny = item as any;

  const useKonvaGlobalElementEvents = useKonvaElementEvents(item, items);

  return <Text
    key={`item-${item.id}`}
    // id={item.id}
    {...itemObjAny}
    draggable={item.draggable === true}
    {...useKonvaGlobalElementEvents}
  /*onClick={() => {
    // setSelectedId(item.id);
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