"use client";

import { useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EditorActions } from "@/lib/features/editor/editorSlice";
import { RootState } from "@/lib/store";
import { POSTER_H, POSTER_W } from "@/utils/editor";

interface Props {
  stageRef: React.RefObject<any>;
}

export default function EventsForZoomingAndPanning({ stageRef }: Props) {
  const dispatch = useDispatch();
  const { scale } = useSelector((state: RootState) => state.editor.view);
  const PADDING = 60;

  const skipFitOnNextRender = useRef(false);
  const isInitialMount = useRef(true);

  const updateStageAndPosition = useCallback((requestedScale: number) => {
    const stage = stageRef?.current;
    const container = document.querySelector('.editor-canvas-engine');
    if (!stage || !container) return;

    const { width: containerW, height: containerH } = container.getBoundingClientRect();

    // DYNAMIC MAX SCALE: The scale required to make the poster width 
    // exactly match the container width (minus padding).
    const dynamicMaxScale = (containerW - PADDING) / POSTER_W;

    // We clamp the scale: 
    // - Lower bound: something small like 0.05
    // - Upper bound: dynamicMaxScale (so it never grows wider than the container)
    const newScale = Math.max(0.05, Math.min(requestedScale, dynamicMaxScale));

    const scaledW = POSTER_W * newScale;
    const scaledH = POSTER_H * newScale;

    // Stage size calculation
    const newStageW = Math.max(containerW, scaledW + PADDING);
    const newStageH = Math.max(containerH, scaledH + PADDING);

    stage.width(newStageW);
    stage.height(newStageH);

    // Centering calculation
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