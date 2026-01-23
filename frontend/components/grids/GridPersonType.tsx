"use client"; // Required for useState in Next.js App Router

import { useEffect, useState } from "react";
import SectionLabel from "../headings/SectionLabel";
import { LS_GetData, LS_KEY_PERSON_TYPE, LS_SaveData } from "@/utils/editor-local-storage";

const PERSONAS = [
  { id: "partner", label: "Partner", icon: "👨" },
  { id: "parent", label: "Parent", icon: "👩" },
  { id: "friend", label: "Friend", icon: "👫" },
  { id: "coworker", label: "Coworker", icon: "👔" },
  { id: "pet", label: "Pet", icon: "🐕" },
  { id: "myself", label: "Myself", icon: "🪞" },
];

export default function GridPersonType() {
  // Initialize with "partner" as the default selected ID
  const [selectedId, setSelectedId] = useState<string>("");

  useEffect(() => {
    const savedPersonType = LS_GetData(LS_KEY_PERSON_TYPE);
    if (savedPersonType) {
      setSelectedId(savedPersonType);
    }
  }, []);

  return (
    <>
      <SectionLabel number={1}>
        Who is this for?{" "}
        <span style={{ color: "#999", fontWeight: "400" }}>(optional)</span>
      </SectionLabel>

      <div className="persona-grid">
        {PERSONAS.map((persona) => {
          const isSelected = selectedId === persona.id;

          return (
            <div
              key={persona.id}
              onClick={() => {
                setSelectedId(persona.id);
                LS_SaveData(LS_KEY_PERSON_TYPE, persona.id);
              }}
              className={`persona-card ${isSelected ? "selected" : ""}`}

            >
              <div className="persona-icon">{persona.icon}</div>
              <div
                className="persona-label"
              >
                {persona.label}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}