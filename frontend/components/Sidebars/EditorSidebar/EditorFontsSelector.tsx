"use client";

import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  //CanvasItemText, 
  EditorActions
} from "@/lib/features/editor/editorSlice";
import { RootState } from "@/lib/store";
// import { customFonts } from "@/lib/fonts";
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

    console.log("fontVariable:", fontVariable);

    /*const resolvedFontName = getResolvedName(fontVariable);
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
    }*/

    dispatch(EditorActions.updateItem({
      id: selectedItem.id,
      // changes: { fontFamily: resolvedFontName },
      changes: { fontFamily: fontVariable },
      addToHistory: true
    }));
  };

  /*const fontOptions = customFonts.map(f => ({
    value: f.variable,
    label: f.name,
    style: { fontFamily: `var(${f.variable})` }
  }));*/

  const fontOptions = [
    { value: "Arial", label: "Arial", style: { fontFamily: "Arial" } },
    { value: "Courier New", label: "Courier New", style: { fontFamily: "Courier New" } },
    { value: "Garamond", label: "Garamond", style: { fontFamily: "Garamond" } },
    { value: "Time New Roman", label: "Time New Roman", style: { fontFamily: "Time New Roman" } },
    { value: "Trebuchet MS", label: "Trebuchet MS", style: { fontFamily: "Trebuchet MS" } },
    { value: "Verdana", label: "Verdana", style: { fontFamily: "Verdana" } },
    // { value: "Aguafina Script", label: "Aguafina Script", style: { fontFamily: "Aguafina Script" } }, // not existing
    { value: "Aclonica", label: "Aclonica", style: { fontFamily: "Aclonica" } },
    // { value: "Akronim", label: "Akronim", style: { fontFamily: "Akronim" } }, // not existing
    { value: "Alex Brush", label: "Alex Brush", style: { fontFamily: "Alex Brush" } }, // it is ALEX____.otf font and i am not sure it is the right
    { value: "Allan", label: "Allan", style: { fontFamily: "Allan" } },
    { value: "Amaranth", label: "Amaranth", style: { fontFamily: "Amaranth" } },
    { value: "Averia Gruesa Libre", label: "Averia Gruesa Libre", style: { fontFamily: "Averia Gruesa Libre" } }, // we have font Averia-Gruesa.ttf but not "Averia Gruesa Libre"
    { value: "Baloo Tammudu", label: "Baloo Tammudu", style: { fontFamily: "Baloo Tammudu" } },
    { value: "Barrio", label: "Barrio", style: { fontFamily: "Barrio" } },
    { value: "Cairo", label: "Cairo", style: { fontFamily: "Cairo" } },
    { value: "Cinzel Decorative", label: "Cinzel Decorative", style: { fontFamily: "Cinzel Decorative" } },
    { value: "Cookie", label: "Cookie", style: { fontFamily: "Cookie" } },
    { value: "Cuprum", label: "Cuprum", style: { fontFamily: "Cuprum" } },
    // { value: "Fjord One", label: "Fjord One", style: { fontFamily: "Fjord One" } }, //don't exist
    { value: "Gupter", label: "Gupter", style: { fontFamily: "Gupter" } },
    { value: "Limelight", label: "Limelight", style: { fontFamily: "Limelight" } },
    // { value: "Londrina Shadow", label: "Londrina Shadow", style: { fontFamily: "Londrina Shadow" } }, // don't exist
    // { value: "Monoton", label: "Monoton", style: { fontFamily: "Monoton" } }, // don't exist
    // { value: "Mystery Quest", label: "Mystery Quest", style: { fontFamily: "Mystery Quest" } }, // don't exist
  ];

  /*const currentVariable = customFonts.find(f =>
    getResolvedName(f.variable) === selectedItem.fontFamily
  )?.variable || "";*/
  const currentVariable = selectedItem.fontFamily;

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