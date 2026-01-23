"use client";

import * as EditorActions from '@/lib/features/editor/editorSlice';
import { AppDispatch, RootState } from '@/lib/store';
import { POSTER_H, POSTER_W } from '@/utils/editor';
import { LS_GetData, LS_KEY_IMAGE_URL } from '@/utils/editor-local-storage';
// import { RootState } from '@reduxjs/toolkit/query';
import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Rect, Text, Transformer, Group, Image as KonvaImage } from 'react-konva';
import { useDispatch, useSelector } from 'react-redux';
import EventsForZoomingAndPanning from './EventsForZoomingAndPanning';
import Konva from 'konva';

// Sub-component to handle "Background Cover" logic
const BackgroundCover = ({ url, targetWidth, targetHeight }: any) => {
  const [img, setImg] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!url) return;
    const image = new window.Image();
    image.src = url;
    image.onload = () => setImg(image);
  }, [url]);

  if (!img) return null;

  // Calculate "Cover" scaling
  const scale = Math.max(targetWidth / img.width, targetHeight / img.height);
  const width = img.width * scale;
  const height = img.height * scale;

  // Center the image inside the crop area
  const x = (targetWidth - width) / 2;
  const y = (targetHeight - height) / 2;

  return (
    <Group clipX={0} clipY={0} clipWidth={targetWidth} clipHeight={targetHeight}>
      <KonvaImage
        image={img}
        x={x}
        y={y}
        width={width}
        height={height}
      />
    </Group>
  );
};

// A simple singleton object to hold the reference
/**
 * This object is global object that I will use in the another parts of the application
 */
export const canvasRefs = {

  pageGroup: null as Konva.Group | null,

  transformRef: null as Konva.Transformer | null,
};

export default function KonvaStage({
  // items,
  // setItems,
  // selectedId,
  // setSelectedId,
  // scale,
  // onScaleChange,
  dimensions,
  initialItems
}: any) {
  /// const trRef = useRef<any>(null);
  const stageRef = useRef<any>(null);
  // const [coverURL, setCoverURL] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();

  // 1. Read the current image from Redux
  const coverURL = useSelector((state: RootState) => state.editor.imageUrl);
  const status = useSelector((state: RootState) => state.editor.status);
  const selectedKonvaItem = useSelector((state: RootState) => state.editor.selectedKonvaItem);
  const items = useSelector((state: RootState) => state.editor.items);
  const view = useSelector((state: RootState) => state.editor.view);


  console.log("KonvaStage items:", items);

  /*const centerX = (dimensions.width / 2) - (POSTER_W * view.scale) / 2;
  const centerY = (dimensions.height / 2) - (POSTER_H * view.scale) / 2;*/

  useEffect(() => {
    if (
      // selectedId 
      selectedKonvaItem !== null && canvasRefs.transformRef && stageRef.current) {
      const node = stageRef.current.findOne('#' + selectedKonvaItem.id);
      if (node) {
        canvasRefs.transformRef.nodes([node]);
        canvasRefs.transformRef?.getLayer()?.batchDraw();
      }
    }
  }, [selectedKonvaItem, items, view.scale]);

  useEffect(() => {
    // console.log("LS_GetData(LS_KEY_IMAGE_URL):", LS_GetData(LS_KEY_IMAGE_URL));
    // setCoverURL(LS_GetData(LS_KEY_IMAGE_URL));
  }, []);

  /*const handleWheel = (e: any) => {
    if (e.evt.ctrlKey || e.evt.metaKey) {
      e.evt.preventDefault();
      const delta = e.evt.deltaY > 0 ? -0.1 : 0.1;
      const newScale = Math.min(Math.max(0.1, view.scale + delta), 3);
      dispatch(EditorActions.setScale(newScale));
    }
  };*/

  return (
    <>
      <Stage
        className='konvajs-content-holder'
        /*style={{
          "--zoom": view.scale,
        "--scroll-x": `${view.x}px`,
        "--scroll-y": `${view.y}px`
      } as React.CSSProperties}*/
        width={dimensions.width}
        height={dimensions.height}
        // scaleX={2}
        // scaleY={2}
        ref={stageRef}
        // onWheel={handleWheel}
        onMouseDown={(e) => {
          if (e.target === e.target.getStage()) {

            // this is working, but when input text is focused, and we set to null, blur event of input don't work
            // dispatch(EditorActions.setselectedKonvaItem(null));
          }
          // console.log("Stage onMouseDown:: e.target:", e?.target);
        }}
      >
        <EventsForZoomingAndPanning stageRef={stageRef} />
        {
          // <EditorCanvasHistoryHydrating />
        }

        <Layer>

          {
            // one group is one page, if client will need more pages i will need to solve this somehow
          }
          <Group
            x={view.x}
            y={view.y}
            scaleX={view.scale}
            scaleY={view.scale}
            width={POSTER_W}
            height={POSTER_H}
            ref={(node) => {
              canvasRefs.pageGroup = node;
            }}

          >
            {/* 1. Base Fallback (Red) */}
            <Rect
              width={POSTER_W} height={POSTER_H} fill="silver"
              shadowColor="black"
              shadowBlur={20}         // How soft the shadow is
              shadowOpacity={0.5}     // Transparency (0 to 1)
              shadowOffset={{ x: 10, y: 10 }} // Position: positive x/y moves it right/down
              onMouseDown={(e: any) => {
                console.log("Rect onMouseDown");
                // setSelectedId(null);
                dispatch(EditorActions.setselectedKonvaItem(null));
              }}
            />

            {/* 2. Background Image with Cover logic */}
            {coverURL && (
              <BackgroundCover
                url={coverURL}
                targetWidth={POSTER_W}
                targetHeight={POSTER_H}
                onMouseDown={(e: any) => {
                  console.log("Cover onMouseDown");
                  // setSelectedId(null);
                  dispatch(EditorActions.setselectedKonvaItem(null));
                }}
              />
            )}

            {/* 3. Poster Border (Always on top of background) */}
            {
              /*<Rect
              width={POSTER_W}
              height={POSTER_H}
              fill="transparent"
              stroke="black"
              strokeWidth={4}
              listening={false} // Prevents border from stealing clicks from text
            />*/
            }

            {/* 4. Draggable Elements */}
            {items.map((item: any) => {
              if (item.type === 'text')
                return <Text
                  key={`item-${item.id}`}
                  id={item.id}
                  {...item}
                  draggable={false}
                  onClick={() => {
                    // setSelectedId(item.id);
                    dispatch(EditorActions.setselectedKonvaItem(item));
                  }}
                  onDragEnd={(e) => {
                    /*const updated = items.map((i: any) =>
                      i.id === item.id ? { ...i, x: e.target.x(), y: e.target.y() } : i
                    );*/
                    const updatedItem = items.find((i: any) => i.id === item.id);
                    if (updatedItem) {
                      // updatedItem.x = e.target.x();
                      // updatedItem.y = e.target.y();
                      // setItems(updated);
                      dispatch(EditorActions.updatePosition(
                        {
                          id: updatedItem.id,
                          x: e.target.x(),
                          y: e.target.y()
                        }
                      ));
                    }
                  }}
                />
              return null;
            })}
            {
              // selectedId 
              selectedKonvaItem !== null &&
              <Transformer
                ref={(node) => {
                  canvasRefs.transformRef = node;
                }}
                anchorSize={8}
                // anchorFill="#ffffff"
                anchorStroke="#3f51b5"
                // anchorCornerRadius={10} // Makes anchors circular

                // Border (the lines) styling
                borderStroke="#3b82f6"
                borderStrokeWidth={3}
                borderDash={[0, 0]} // Makes the border dashed
                rotateEnabled={false}
                resizeEnabled={false}
                backgroundFill="rgba(59, 130, 246, 0.7)"
                fill="rgba(59, 130, 246, 0.7)"
                anchorFill="rgba(59, 130, 246, 0.7)"
                padding={10}
                anchorCornerRadius={40}
              />}
          </Group>

        </Layer>
      </Stage >
    </>
  );
}