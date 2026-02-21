import { useDispatch } from 'react-redux';
import * as EditorActions from '@/lib/features/editor/editorSlice';
import { useSelector } from 'react-redux';
import { POSTER_H, POSTER_W } from '@/utils/editor';

export const useKonvaElementEvents = (item: any, items: any[]) => {
  const dispatch = useDispatch();

  const selectedKonvaItem = useSelector((state: any) => state.editor.selectedKonvaItem);
  const editorState = useSelector((state: any) => state.editor);

  let iCanUpdateHistory = false;

  const onClick = () => {
    if (item.id === selectedKonvaItem?.id) {
      dispatch(EditorActions.setselectedKonvaItem(null));
    }
    else {
      dispatch(EditorActions.setselectedKonvaItem(item));
    }

  };


  const onDragMove = (e: any) => {
    console.log("onDragMove item:", item, selectedKonvaItem);
    const dragBound = ___dragBoundFunc({ x: e.target.x(), y: e.target.y() }, e.target);
    e.target.x(dragBound.x);
    e.target.y(dragBound.y);
    if (!iCanUpdateHistory) iCanUpdateHistory = true;
  };
  const onDragEnd = (e: any) => {

    if (!iCanUpdateHistory) {
      return;
    }
    // const dragBound = ___dragBoundFunc({ x: e.target.x(), y: e.target.y() });

    console.log("onDragEnd item:", item, selectedKonvaItem);

    // if(editorState.)
    // const latestHistoryItem = editorState.history[editorState.history.length - 1];
    /*if (e.target.x() === latestHistoryItem.x && e.target.y() === latestHistoryItem.y) {
      // return;
    }
    else {

      dispatch(EditorActions.updateItem({
        id: item.id,
        changes: {
          x: e.target.x(),
          y: e.target.y(),
        },
        addToHistory: true
      }));
    }*/

    dispatch(EditorActions.updateItem({
      id: item.id,
      changes: {
        x: e.target.x(),
        y: e.target.y(),
      },
      addToHistory: true
    }));
    iCanUpdateHistory = false;
    setTimeout(() => {
      iCanUpdateHistory = true;
    }, 100);

  };

  const ___dragBoundFunc = (pos: { x: number; y: number }, kanvaObject: any) => {
    // 1. Get the current dimensions
    // If it's Text, ensure item.width is actually defined, 
    // otherwise Konva defaults to the text width
    console.log("item:", item, selectedKonvaItem);
    const width = kanvaObject.width() || 0;
    const height = kanvaObject.height() || 0;

    // 2. Clamp logic
    // We restrict the ABSOLUTE position (pos) to the poster bounds
    const x = Math.max(0, Math.min(pos.x, POSTER_W - width));
    const y = Math.max(0, Math.min(pos.y, POSTER_H - height));

    console.log("dragBoundFunc", x, y, width);

    return { x, y };
  };

  return { onClick: onClick, onTap: onClick, onDragEnd, onDragMove };
};

