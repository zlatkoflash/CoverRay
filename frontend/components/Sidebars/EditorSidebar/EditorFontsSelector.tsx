"use client";

import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CanvasItemText, EditorActions } from "@/lib/features/editor/editorSlice";
import { RootState } from "@/lib/store";
import { customFonts } from "@/lib/fonts";

export default function EditorFontsSelector() {
  const dispatch = useDispatch();
  const selectedItem = useSelector((state: RootState) => state.editor.selectedKonvaItem) as CanvasItemText;

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Helper function to resolve the CSS variable to the actual hashed font name
  const getResolvedName = (variable: string) => {
    // If the component hasn't mounted or ref isn't set, we can't read CSS
    if (typeof window === 'undefined' || !dropdownRef.current) return "";

    // This looks at the styles applied TO THIS DIV (and inherited from .container)
    const style = window.getComputedStyle(dropdownRef.current);
    const value = style.getPropertyValue(variable).trim();

    return value.replace(/['"]/g, "");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!selectedItem || selectedItem.type !== 'text') return null;

  const handleFontSelect = async (fontVariable: string) => {
    // 1. Get the real hashed name (e.g., "allan_bold_123...")
    const resolvedFontName = getResolvedName(fontVariable);
    console.log("resolvedFontName", resolvedFontName);

    if (!resolvedFontName) return;

    // 2. Construct a valid Font API string (no 'var()' here!)
    const fontToLoad = `16px "${resolvedFontName}"`;

    if (document.fonts) {
      try {
        // Check and load using the raw hashed name
        if (!document.fonts.check(fontToLoad)) {
          console.log("Loading font file...");
          await document.fonts.load(fontToLoad);
        }
      } catch (e) {
        // If the browser still complains, it's likely a timing issue with Next.js
        console.warn("Font loading API error, continuing to render:", e);
      }
    }

    // 3. Update Redux with the resolved name for Konva
    dispatch(EditorActions.updateItem({
      id: selectedItem.id,
      changes: { fontFamily: resolvedFontName },
      addToHistory: true
    }));

    setIsOpen(false);
  };

  // Find label by comparing the resolved hash in Redux to the resolved hashes of our registry
  const currentFontLabel = customFonts.find(f => {
    const resolved = getResolvedName(f.variable);
    return resolved === selectedItem.fontFamily;
  })?.name || "Select Font";

  // --- STYLING OBJECTS ---
  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%'
  };

  const triggerButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: '8px 12px',
    cursor: 'pointer',
    // For the UI button, we can use the hash directly as the fontFamily
    fontFamily: selectedItem.fontFamily,
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px'
  };

  const menuStyle: React.CSSProperties = {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    zIndex: 1000,
    marginTop: '4px',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    maxHeight: '300px',
    overflowY: 'auto'
  };

  const getOptionStyle = (fontVariable: string): React.CSSProperties => {
    const resolved = getResolvedName(fontVariable);
    const isActive = selectedItem.fontFamily === resolved;

    return {
      padding: '10px 12px',
      cursor: 'pointer',
      fontFamily: `var(${fontVariable})`, // HTML dropdown can still use the variable
      fontSize: '18px',
      backgroundColor: isActive ? '#f0f4ff' : 'transparent',
      transition: 'background-color 0.1s'
    };
  };

  return (
    <div className="panel-section" ref={dropdownRef}>
      <div className="section-title">Font Family</div>

      <div style={containerStyle}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          style={triggerButtonStyle}
          className="form-input"
        >
          <span>{currentFontLabel}</span>
          <svg
            style={{
              width: '16px',
              height: '16px',
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s'
            }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div style={menuStyle}>
            {customFonts.map((font) => (
              <div
                key={font.variable}
                onClick={() => handleFontSelect(font.variable)}
                style={getOptionStyle(font.variable)}
                onMouseEnter={(e) => {
                  const resolved = getResolvedName(font.variable);
                  if (selectedItem.fontFamily !== resolved) {
                    e.currentTarget.style.backgroundColor = '#f8f9fa';
                  }
                }}
                onMouseLeave={(e) => {
                  const resolved = getResolvedName(font.variable);
                  e.currentTarget.style.backgroundColor = selectedItem.fontFamily === resolved ? '#f0f4ff' : 'transparent';
                }}
              >
                {font.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}