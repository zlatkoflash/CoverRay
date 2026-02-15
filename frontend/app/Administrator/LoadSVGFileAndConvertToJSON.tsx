'use client';

import React, { useRef } from 'react';
import { generateJSON } from './scripts/htmlToJSON';
import { RefObject } from 'react';
import { getApiData } from '@/utils/api';

export default function LoadHTMLFileAndConvertToJSON() {
  const holderRef = useRef<HTMLDivElement>(null);
  const TARGET_WIDTH = 1200;


  const __GenerateTheHTMLAndSave = async (htmlContent: string) => {
    const json = await generateJSON(htmlContent, holderRef as RefObject<HTMLDivElement>, TARGET_WIDTH);
    console.log("Generated JSON:", json);


    const results = await getApiData("/administrator/save_json_HTMLtoJSON", "POST", {
      json,
      // target_width: TARGET_WIDTH
    }, "authorize", "application/json");

    console.log("Results:", results);
  };

  const handleButtonClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.html,.txt';
    input.onchange = async (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const htmlContent = event.target?.result as string;
          __GenerateTheHTMLAndSave(htmlContent);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };



  return (
    <div className="p-10 flex flex-col items-center">
      <button
        className="bg-indigo-600 text-white px-8 py-4 rounded-lg font-bold shadow-xl hover:bg-indigo-700 transition"
        onClick={handleButtonClick}
      >
        Convert HTML (P-Group Enabled)
      </button>
      <div ref={holderRef} style={{ position: 'absolute', left: '-9999px', top: '0', visibility: 'visible' }} />
    </div>
  );
}