"use client";

import { useEffect, useRef } from 'react';
import { Text } from 'react-konva';
import { useDispatch } from 'react-redux';
import * as EditorActions from '@/lib/features/editor/editorSlice';
import { useKonvaElementEvents } from '@/lib/features/editor/editorHooks';
import { IKonvaBaseCanvasItem, IKonvaTemplateTextItem } from '@/utils/interfaceTemplate';
import Konva from 'konva';

export default function ZKonvaTextComponent({ item, items }: { item: IKonvaTemplateTextItem, items: IKonvaBaseCanvasItem[] }) {
  const dispatch = useDispatch();
  const textRef = useRef<Konva.Text>(null);

  // We use this ref to track the "previous" auto-calculated width 
  // so we know how much the text grew or shrank.
  const lastAutoWidthRef = useRef<number>(0);

  const useKonvaGlobalElementEvents = useKonvaElementEvents(item, items);

  /*useEffect(() => {
    if (!textRef.current) return;

    const node = textRef.current;
    const currentWidth = node.width(); // Konva's auto-calculated width
    const oldWidth = lastAutoWidthRef.current;

    // Only perform the shift if it's right-aligned and the width actually changed
    if (item.align === 'right' && oldWidth !== 0 && currentWidth !== oldWidth) {
      const widthDiff = currentWidth - oldWidth;
      const newX = item.x - widthDiff;

      dispatch(EditorActions.updateItem({
        id: item.id,
        changes: { x: newX }, // Only updating X, NOT width
        addToHistory: false,
      }));
    }

    // Always update the ref so the next character typed has a correct starting point
    lastAutoWidthRef.current = currentWidth;
  }, [item.text, item.fontSize, item.fontFamily, item.align, item.x]);*/
  // Added item.x to dependencies to ensure the ref stays in sync if the item is moved

  return (
    <Text
      ref={textRef}
      key={`item-${item.id}`}
      id={item.id}
      {...(item as any)}
      // We ensure 'width' is NOT passed if you want it to be fully dynamic, 
      // though typically itemObjAny might contain it. 
      // If your 'item' has a fixed width, Konva won't auto-calculate.
      draggable={item.draggable === true}
      {...useKonvaGlobalElementEvents}
    />
  );
}