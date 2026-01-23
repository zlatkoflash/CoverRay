"use client"

import EditorCanvasToolbar from "./EditorCanvasToolbar"
import EditorCanvasZoom from "./EditorCanvasZoom"
import EditorWrap from "./EditorWrap"

export default function EditorCanvasFinal({
  // template 
}: {
    // template: any 
  }) {
  return <div className="editor-canvas-area">


    <EditorWrap
    // template={template}
    />

    <EditorCanvasToolbar />
    <EditorCanvasZoom />

  </div>
}