"use client";

import { useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EditorActions } from "@/lib/features/editor/editorSlice";
import { RootState } from "@/lib/store";
import { POSTER_H, POSTER_W } from "@/utils/editor";
import { useDevice } from "@/Providers/DeviceProvider";

interface Props {
  stageRef: React.RefObject<any>;
}

export default function EventsForZoomingAndPanning({ stageRef }: Props) {

  const { isMobile } = useDevice();

  const dispatch = useDispatch();
  const { scale } = useSelector((state: RootState) => state.editor.view);
  const PADDING = isMobile ? 20 : 60;

  const skipFitOnNextRender = useRef(false);
  const isInitialMount = useRef(true);

  const updateStageAndPosition = useCallback((requestedScale: number) => {
    const stage = stageRef?.current;
    const container: any = document.querySelector('.editor-canvas-engine');
    const containerHolder: any = document.querySelector('.konvajs-content-holder');

    if (!stage || !container) return;

    if (containerHolder.style.display === "none") {
      containerHolder.style.display = "block";
    }

    const { width: containerW, height: containerH } = container.getBoundingClientRect();

    // 1. Calculate the base scale (fitting exactly to container)
    const fitToContainerScale = (containerW - PADDING) / POSTER_W;

    // 2. Set the MAX SCALE to be 1.5x the width of the container
    // This allows the user to zoom in until the poster is 150% of the screen width
    const dynamicMaxScale = fitToContainerScale * 2;

    // 3. Clamp the scale
    // Lower bound: 0.05
    // Upper bound: 1.5x container width
    const newScale = Math.max(0.05, Math.min(requestedScale, dynamicMaxScale));

    const scaledW = POSTER_W * newScale;
    const scaledH = POSTER_H * newScale;

    // 4. Stage size calculation
    // We ensure the stage is at least as large as the container, 
    // or as large as the scaled poster + padding if it's zoomed in.
    const newStageW = Math.max(containerW, scaledW + PADDING);
    const newStageH = Math.max(containerH, scaledH + PADDING);

    stage.width(newStageW);
    stage.height(newStageH);

    // 5. Centering calculation
    // If scaledW > containerW, this will still center the "overflowing" poster
    const centerX = (newStageW - scaledW) / 2;
    const centerY = (newStageH - scaledH) / 2;

    dispatch(EditorActions.setView({
      x: centerX,
      y: centerY,
      scale: newScale
    }));
  }, [stageRef, dispatch]);


  // 1. THE "CENTER ON LOAD" FIX
  useEffect(() => {
    if (isInitialMount.current) {
      const container = document.querySelector('.editor-canvas-engine');
      if (container) {
        const { width: cW, height: cH } = container.getBoundingClientRect();
        // Initial fit uses the standard "contain" logic
        const fitScale = Math.min((cW - PADDING) / POSTER_W, (cH - PADDING) / POSTER_H);

        setTimeout(() => {
          updateStageAndPosition(fitScale);
          isInitialMount.current = false;
        }, 50);
      }
    }
  }, [updateStageAndPosition]);

  // 2. RESIZE OBSERVER
  useEffect(() => {
    const container = document.querySelector('.editor-canvas-engine');
    if (!container) return;

    const handleResize = () => {
      const { width: cW, height: cH } = container.getBoundingClientRect();
      // On resize, we force it to the "Contain" scale (showing the whole page)
      const fitScale = Math.min((cW - PADDING) / POSTER_W, (cH - PADDING) / POSTER_H);
      updateStageAndPosition(fitScale);
    };

    const resizeObserver = new ResizeObserver(() => {
      if (!skipFitOnNextRender.current && !isInitialMount.current) {
        handleResize();
      }
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, [updateStageAndPosition]);

  // 3. MANUAL ZOOM
  useEffect(() => {
    if (!isInitialMount.current) {
      skipFitOnNextRender.current = true;
      updateStageAndPosition(scale);

      const timeout = setTimeout(() => {
        skipFitOnNextRender.current = false;
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [scale, updateStageAndPosition]);

  return null;
}