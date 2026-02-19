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
  dropdownStyle?: "for-fonts" | "for-forms";
}

const ZSelectDropdown = forwardRef<HTMLDivElement, ZSelectDropdownProps>(
  ({ options, selectedValue, onSelect, label, triggerStyle, className, dropdownStyle = "for-fonts" }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [openUpwards, setOpenUpwards] = useState(false); // State to track direction
    const internalRef = useRef<HTMLDivElement>(null);
    const containerRef = (ref as RefObject<HTMLDivElement>) || internalRef;

    // logic to determine if we should open upwards
    const toggleDropdown = () => {
      if (!isOpen && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const dropdownMaxHeight = 300; // Matches maxHeight in styles

        // If space below is less than dropdown height, open upwards
        setOpenUpwards(spaceBelow < dropdownMaxHeight);
      }
      setIsOpen(!isOpen);
    };

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
        className={`z-select-dropdown ${className || ""}`}
        style={{ position: "relative" }}
      >
        <button
          type="button"
          onClick={toggleDropdown}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            padding: "8px 12px",
            cursor: "pointer",
            backgroundColor: "#fff",
            border: "1px solid #ddd",
            borderRadius: "4px",
            fontSize: "14px",
            ...triggerStyle,
          }}
        >
          <span>{currentOption?.label || options[0].label}</span>
          <svg
            style={{
              width: "16px",
              height: "16px",
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
            }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div
            className="z-dropdown-items-wrap"
            style={{
              position: "absolute",
              // logic for directional opening
              bottom: openUpwards ? "100%" : "auto",
              top: openUpwards ? "auto" : "100%",
              left: 0,
              right: 0,
              zIndex: 1000,
              // Flip margin based on direction
              marginTop: openUpwards ? "0" : "4px",
              marginBottom: openUpwards ? "4px" : "0",
              backgroundColor: "#fff",
              border: "1px solid #ddd",
              borderRadius: "4px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              maxHeight: "300px",
              overflowY: "auto",
            }}
          >
            {options.map((option) => (
              <div
                className="z-list-item"
                key={option.value}
                onClick={() => {
                  onSelect(option.value);
                  setIsOpen(false);
                }}
                style={{
                  padding: dropdownStyle === "for-forms" ? "5px 6px" : "10px 12px",
                  cursor: "pointer",
                  fontSize: dropdownStyle === "for-forms" ? "14px" : "18px",
                  backgroundColor: selectedValue === option.value ? "#f0f4ff" : "transparent",
                  ...option.style,
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