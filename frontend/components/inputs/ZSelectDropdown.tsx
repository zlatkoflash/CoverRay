"use client";

import { useState, useRef, useEffect, forwardRef, RefObject } from "react";

interface ZSelectOption {
  value: string;
  label: string;
  style?: React.CSSProperties;
}

interface ZSelectDropdownProps {
  options: ZSelectOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  label?: string;
  triggerStyle?: React.CSSProperties;
  className?: string;
  dropdownStyle?: "for-fonts" | "for-forms"
}

const ZSelectDropdown = forwardRef<HTMLDivElement, ZSelectDropdownProps>(
  ({ options, selectedValue, onSelect, label, triggerStyle, className, dropdownStyle = "for-fonts" }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const internalRef = useRef<HTMLDivElement>(null);

    /**
     * FIX: Use RefObject instead of the deprecated MutableRefObject.
     * We cast 'ref' to ensure we can check '.current' during the click-outside check.
     */
    const containerRef = (ref as RefObject<HTMLDivElement>) || internalRef;

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [containerRef]);

    const currentOption = options.find((o) => o.value === selectedValue);

    return (
      <div
        ref={containerRef}
        className={className || ""}
        style={{ position: "relative" }}
      >
        {
          // label && <div className="section-title">{label}</div>
        }

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            padding: '8px 12px',
            cursor: 'pointer',
            backgroundColor: '#fff',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px',
            ...triggerStyle
          }}
        >
          <span>{currentOption?.label || options[0].label}</span>
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
          <div style={{
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
          }}>
            {options.map((option) => (
              <div
                key={option.value}
                onClick={() => {
                  onSelect(option.value);
                  setIsOpen(false);
                }}
                style={{
                  padding: dropdownStyle === "for-forms" ? '5px 6px' : '10px 12px',
                  cursor: 'pointer',
                  fontSize: dropdownStyle === "for-forms" ? '14px' : '18px',
                  backgroundColor: selectedValue === option.value ? '#f0f4ff' : 'transparent',
                  ...option.style
                }}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);

ZSelectDropdown.displayName = "ZSelectDropdown";

export default ZSelectDropdown;