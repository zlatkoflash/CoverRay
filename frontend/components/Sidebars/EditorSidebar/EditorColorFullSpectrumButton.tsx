import React, { useRef, useEffect } from 'react';

interface FullColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  size?: number;
  debounceMs?: number; // Optional control over the delay
}

const EditorColorFullSpectrumButton: React.FC<FullColorPickerProps> = ({
  color,
  onChange,
  size = 40,
  debounceMs = 300
}) => {
  const colorInputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timeout on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleContainerClick = () => {
    colorInputRef.current?.click();
  };

  const handleColorInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;

    // 1. Clear the previous timer if the user is still dragging/clicking
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // 2. Set a new timer
    timeoutRef.current = setTimeout(() => {
      onChange(newColor);
    }, debounceMs);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <input
        ref={colorInputRef}
        type="color"
        // Use defaultValue so the input is "uncontrolled" and smooth 
        // while the user drags, even if the parent state hasn't updated yet.
        defaultValue={color}
        onInput={handleColorInput}
        style={{
          position: "absolute",
          opacity: 0,
          pointerEvents: "none",
          width: 0,
          height: 0
        }}
      />

      <div
        className="color-swatch"
        onClick={handleContainerClick}
        title="Custom color"
        style={{
          // width: `${size * 1.2}px`,
          // height: `${size}px`,
          borderRadius: '8px',
          background: "conic-gradient(red, yellow, lime, aqua, blue, magenta, red)",
          cursor: "pointer",
          position: "relative",
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}
      >
        <div style={{
          width: '40%',
          height: '40%',
          borderRadius: '4px',
          backgroundColor: color, // Shows the "settled" color from props
          border: '1.5px solid white',
          pointerEvents: 'none',
          boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
        }} />
      </div>
    </div>
  );
};

export default EditorColorFullSpectrumButton;