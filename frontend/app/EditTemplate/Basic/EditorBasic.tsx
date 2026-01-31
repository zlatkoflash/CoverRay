

"use client";

import EditorWrap from "@/components/Editor/EditorWrap";
import EditorSidebarPanel from "@/components/EditorSidebarPanel";
import Link from "next/link";
import { useEffect } from "react";

export default function EditorBasic({ template }: { template: any }) {


  useEffect(() => {
    console.log(template);

  }, [template]);


  return (
    <div className="editor-layout">
      <div className="editor-sidebar">
        <div className="progress-bar"><div className="progress-fill" style={{ width: "66%" }}></div></div>
        <div className="progress-text">2 of 3 steps complete</div>
        <div className="step-item">
          <div className="step-icon complete">✓</div>
          <div className="step-content">
            <div className="step-title">Template</div>
            <div className="step-status complete">DOGUE</div>
          </div>
        </div>
        <Link href="/SelectTemplate" className="step-item">
          <div className="step-icon complete">✓</div>
          <div className="step-content">
            <div className="step-title">Photo</div>
            <div className="step-status complete">Uploaded</div>
          </div>
        </Link>
        <div className="step-item active">
          <div className="step-icon active">✎</div>
          <div className="step-content">
            <div className="step-title">Text</div>
            <div className="step-status">In progress</div>
          </div>
        </div>
      </div>
      <div className="editor-canvas">
        {
          // 480x600
          // <div className="canvas-preview">[Live Preview]</div>
        }

        {
          <EditorWrap
          // template={template}
          />
        }
      </div>


      <EditorSidebarPanel initialTemplate={template} />



    </div>
  );
}