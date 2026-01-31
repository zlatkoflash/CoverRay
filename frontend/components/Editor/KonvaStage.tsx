"use client";

import * as EditorActions from '@/lib/features/editor/editorSlice';
import { AppDispatch, RootState } from '@/lib/store';
import { POSTER_H, POSTER_W } from '@/utils/editor';
import { LS_GetData, LS_KEY_IMAGE_URL } from '@/utils/editor-local-storage';
// import { RootState } from '@reduxjs/toolkit/query';
import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Rect, Text, Transformer, Group, Image as KonvaImage, Image } from 'react-konva';
import { useDispatch, useSelector } from 'react-redux';
import EventsForZoomingAndPanning from './EventsForZoomingAndPanning';
import Konva from 'konva';
import { IKonvaBaseCanvasItem } from '@/utils/interfaceTemplate';
import ZKonvaTextComponent from './Elements/ZKonvaTextComponent';
import ZKonvaImageComponent from './Elements/ZKonvaImageComponent';

// Sub-component to handle "Background Cover" logic
const BackgroundCover = ({ url, targetWidth, targetHeight, opacity = 1, onMouseDown, fillType = "cover" }: {
  url: string;
  targetWidth: number;
  targetHeight: number;
  opacity?: number;
  onMouseDown?: (e: any) => void;
  fillType?: "cover" | "contain" | "stretch" | "tile";
}) => {
  const [img, setImg] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!url) return;
    const image = new window.Image();
    image.src = url;
    image.crossOrigin = "Anonymous";
    image.onload = () => setImg(image);
  }, [url]);

  if (!img) return null;

  // Calculate "Cover" scaling
  let scale = Math.max(targetWidth / img.width, targetHeight / img.height);
  let width = img.width * scale;
  let height = img.height * scale;

  // Center the image inside the crop area
  let x = (targetWidth - width) / 2;
  let y = (targetHeight - height) / 2;

  switch (fillType) {
    case "cover":
      scale = Math.max(targetWidth / img.width, targetHeight / img.height);
      width = img.width * scale;
      height = img.height * scale;
      x = (targetWidth - width) / 2;
      y = (targetHeight - height) / 2;
      break;
    case "contain":
      scale = Math.min(targetWidth / img.width, targetHeight / img.height);
      width = img.width * scale;
      height = img.height * scale;
      x = (targetWidth - width) / 2;
      y = (targetHeight - height) / 2;
      break;
    case "stretch":
      scale = 1;
      width = targetWidth;
      height = targetHeight;
      x = 0;
      y = 0;
      break;
    case "tile":
      scale = 1;
      width = img.width;
      height = img.height;
      x = 0;
      y = 0;
      break;
  }

  return (
    <Group clipX={0} clipY={0} clipWidth={targetWidth} clipHeight={targetHeight}>
      <KonvaImage
        image={img}
        x={x}
        y={y}
        width={width}
        height={height}
        opacity={opacity}
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
  const templateState = useSelector((state: RootState) => state.template);
  const templateDB = templateState.selectedTemplate;
  const stateAuth = useSelector((state: RootState) => state.auth);
  const user = stateAuth.user;
  const stateEditor = useSelector((state: RootState) => state.editor);
  // const template = stateEditor.template;
  const konvaData = stateEditor.konvaData;
  // const templateDB = stateEditor.templ;
  const coverURL = stateEditor.imageUrl;
  const status = stateEditor.status;
  const selectedKonvaItem = stateEditor.selectedKonvaItem;
  // const items = stateEditor.items;
  let items: IKonvaBaseCanvasItem[] = [];
  try {
    items = konvaData?.pages[0].children || [];
  } catch (e) {
    console.log("KonvaStage :: stateEditor.konvaData", e);
  }
  const view = stateEditor.view;


  console.log("KonvaStage items:", items);

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
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedKonvaItem || e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const directions: Record<string, 'up' | 'down' | 'left' | 'right'> = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right',
      };

      const MovePerKeyPress = 1;

      let changes = {};
      if (directions[e.key] === "down") {
        changes = {
          y: selectedKonvaItem.y + MovePerKeyPress
        }
      }
      else if (directions[e.key] === "up") {
        changes = {
          y: selectedKonvaItem.y - MovePerKeyPress
        }
      }
      else if (directions[e.key] === "left") {
        changes = {
          x: selectedKonvaItem.x - MovePerKeyPress
        }
      }
      else if (directions[e.key] === "right") {
        changes = {
          x: selectedKonvaItem.x + MovePerKeyPress
        }
      }
      else {
        return;
      }

      e.preventDefault();
      dispatch(EditorActions.updateItem({
        id: selectedKonvaItem.id,
        changes: changes,
        addToHistory: false
      }));

    };



    window.addEventListener("keydown", handleKeyDown);
    // window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      // window.removeEventListener("keyup", handleKeyUp);
    }
  }, [
    selectedKonvaItem?.id,
    selectedKonvaItem?.x,
    selectedKonvaItem?.y,
    dispatch

  ]); // Only re-run if the SELECTED ID changes


  if (konvaData === null) {
    return null;
  }

  return (
    <>
      <Stage
        className='konvajs-content-holder'

        width={dimensions.width}
        height={dimensions.height}

        ref={stageRef}
        // onWheel={handleWheel}

        style={{
          // on start we hide .konvajs-content-holder, on first resize we show inside <EventsForZoomingAndPanning />, this way i prevent the glitch of the canvas and resize on initial mount
          display: "none"
        }}
        onMouseDown={(e) => {
          if (e.target === e.target.getStage()) {

            // this is working, but when input text is focused, and we set to null, blur event of input don't work
            // dispatch(EditorActions.setselectedKonvaItem(null));
          }
          // console.log("Stage onMouseDown:: e.target:", e?.target);
        }}
      >
        {
          <EventsForZoomingAndPanning stageRef={stageRef} />
        }

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

            {
              templateDB !== null && templateDB.catalog_image !== "" &&
              <BackgroundCover
                url={templateDB.catalog_image}
                targetWidth={POSTER_W}
                targetHeight={POSTER_H}
                opacity={0.5}
                fillType="stretch"
                onMouseDown={(e: any) => {
                  console.log("Cover onMouseDown");
                  // setSelectedId(null);
                  dispatch(EditorActions.setselectedKonvaItem(null));
                }}
              />
            }



            {/* 4. Draggable Elements */}
            {items?.map((item: any) => {

              const draggable = (user !== null && user.role === "administrator");
              console.log("item.type::", item.type);

              if (item.type === 'text')

                return <ZKonvaTextComponent key={`item-${item.id}`} item={item} items={items} />
              else if (item.type === "image") {
                console.log("Image element:", item);

                return <ZKonvaImageComponent key={`item-${item.id}`} item={item} items={items} />
              }

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
              // padding={10}
              // anchorCornerRadius={40}
              />}
          </Group>

        </Layer>
      </Stage >
    </>
  );
}