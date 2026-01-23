"use client";

import { useEffect, useState } from "react";
import SectionLabel from "../headings/SectionLabel";
import { LS_GetData, LS_KEY_OCCATION_TYPE, LS_SaveData } from "@/utils/editor-local-storage";

const OCCASIONS = [
  { id: "birthday", label: "Birthday", icon: "🎂" },
  { id: "anniversary", label: "Anniversary", icon: "💍" },
  { id: "graduation", label: "Graduation", icon: "🎓" },
  { id: "achievement", label: "Achievement", icon: "🏆" },
];

export default function GridOccationType() {
  // Initialized with "anniversary" to match your original "selected" state
  const [selectedId, setSelectedId] = useState<string>("");

  useEffect(() => {
    const savedOccationType = LS_GetData(LS_KEY_OCCATION_TYPE);
    if (savedOccationType) {
      setSelectedId(savedOccationType);
    }
  }, []);

  return (
    <>
      <SectionLabel number={2}>
        What's the occasion?{" "}
        <span style={{ color: "#999", fontWeight: "400" }}>(optional)</span>
      </SectionLabel>

      <div
        className="persona-grid"
        style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
      >
        {OCCASIONS.map((occ) => (
          <div
            key={occ.id}
            onClick={() => {
              setSelectedId(occ.id);
              LS_SaveData(LS_KEY_OCCATION_TYPE, occ.id);
            }}
            className={`persona-card ${selectedId === occ.id ? "selected" : ""}`}
            style={{ cursor: "pointer" }}
          >
            <div className="persona-icon">{occ.icon}</div>
            <div className="persona-label">{occ.label}</div>
          </div>
        ))}
      </div>
    </>
  );
}