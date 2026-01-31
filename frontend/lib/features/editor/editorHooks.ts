import { useDispatch } from 'react-redux';
import * as EditorActions from '@/lib/features/editor/editorSlice';
import { useSelector } from 'react-redux';

export const useKonvaElementEvents = (item: any, items: any[]) => {
  const dispatch = useDispatch();

  const selectedKonvaItem = useSelector((state: any) => state.editor.selectedKonvaItem);

  const onClick = () => {
    if (item.id === selectedKonvaItem?.id) {
      dispatch(EditorActions.setselectedKonvaItem(null));
    }
    else {
      dispatch(EditorActions.setselectedKonvaItem(item));
    }

  };


  const onDragEnd = (e: any) => {
    // Optimization: Use item.id directly instead of .find() 
    // since 'item' is already in scope from the argument

    /*const updatedItem = items.find((i: any) => i.id === item.id);
    if (!updatedItem) {
      return;
    }*/

    /*dispatch(EditorActions.updatePosition({
      // id: updatedItem.id,
      id: item.id,
      x: e.target.x(),
      y: e.target.y(),
    }));*/

    dispatch(EditorActions.updateItem({
      id: item.id,
      changes: {
        x: e.target.x(),
        y: e.target.y(),
      },
      addToHistory: true
    }));
  };

  return { onClick, onDragEnd };
};