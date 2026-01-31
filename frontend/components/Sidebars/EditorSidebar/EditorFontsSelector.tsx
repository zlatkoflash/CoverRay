"use client";

import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  //CanvasItemText, 
  EditorActions
} from "@/lib/features/editor/editorSlice";
import { RootState } from "@/lib/store";
import { customFonts } from "@/lib/fonts";
import ZSelectDropdown from "@/components/inputs/ZSelectDropdown";
import { IKonvaTemplateTextItem } from "@/utils/interfaceTemplate";

export default function EditorFontsSelector() {
  const dispatch = useDispatch();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedItem = useSelector((state: RootState) => state.editor.selectedKonvaItem) as IKonvaTemplateTextItem;
  // as CanvasItemText


  if (!selectedItem || selectedItem.type !== 'text') return null;

  const getResolvedName = (variable: string) => {
    if (typeof window === 'undefined' || !dropdownRef.current) return "";
    // We read from the actual dropdown DOM node where CSS vars are defined
    const style = window.getComputedStyle(dropdownRef.current);
    const value = style.getPropertyValue(variable).trim();
    return value.replace(/['"]/g, "");
  };

  const handleFontSelect = async (fontVariable: string) => {
    const resolvedFontName = getResolvedName(fontVariable);
    if (!resolvedFontName) return;

    const fontToLoad = `16px "${resolvedFontName}"`;
    if (document.fonts) {
      try {
        if (!document.fonts.check(fontToLoad)) {
          await document.fonts.load(fontToLoad);
        }
      } catch (e) {
        console.warn("Font loading error:", e);
      }
    }

    dispatch(EditorActions.updateItem({
      id: selectedItem.id,
      changes: { fontFamily: resolvedFontName },
      addToHistory: true
    }));
  };

  const fontOptions = customFonts.map(f => ({
    value: f.variable,
    label: f.name,
    style: { fontFamily: `var(${f.variable})` }
  }));

  const currentVariable = customFonts.find(f =>
    getResolvedName(f.variable) === selectedItem.fontFamily
  )?.variable || "";

  return (
    <div className="panel-section" ref={dropdownRef}>
      <div className="section-title">Font Family</div>
      <ZSelectDropdown
        ref={dropdownRef} // Passing the ref here solves the empty string issue!
        label="Font Family"
        options={fontOptions}
        selectedValue={currentVariable}
        onSelect={handleFontSelect}
        triggerStyle={{ fontFamily: selectedItem.fontFamily }}
        className="w-100"
      />
    </div>
  );
}