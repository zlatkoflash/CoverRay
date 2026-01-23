import EditorWrap from "@/components/Editor/EditorWrap";
import ScreenHeader from "@/components/headers/ScreenHeader.delete";
import Link from "next/link";

import exampleJSONTemplate from '@/example-templates/birthday.json';
import EditorSidebarPanel from "@/components/EditorSidebarPanel";
import EditorBasic from "./EditorBasic";

export default function PageClientBasicEditTemplate() {
  return (
    <div className="screen">
      <ScreenHeader>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <button className="header-btn">Save Draft</button>
          <button className="btn-primary" style={{ padding: "10px 20px" }}>Preview →</button>
        </div>
      </ScreenHeader>


      <EditorBasic template={exampleJSONTemplate} />


    </div>
  );
}