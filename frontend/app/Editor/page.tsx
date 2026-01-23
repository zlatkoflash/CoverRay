

import EditorCanvasFinal from "@/components/Editor/EditorCanvasFinal";
import EditorHydrator from "@/components/Editor/EditorHydrator";
import Header from "@/components/headers/Header";
// import EditorFontsSelector from "@/components/Sidebars/EditorSidebar/EditorFontsSelector";
import EditorSidebar from "@/components/Sidebars/EditorSidebar/Index";
// import { editorFontVariables, editorFonts } from "@/lib/fonts";

import exampleJSONTemplate from '@/example-templates/birthday.json';
import { allEditorFontVariables, customFonts } from "@/lib/fonts";
// import { allFontVariables, customFonts } from "@/lib/fonts";

export default function Editor() {


  return (
    <>
      {/* 1. The silent worker starts loading data in the background */}
      <EditorHydrator template={{
        template_data: exampleJSONTemplate
      } as any} />

      <Header />

      <div className={`main-container ${allEditorFontVariables}`}>
        <div className="screen active" id="screen2">
          <div className="editor-layout">
            <EditorCanvasFinal
            // template={exampleJSONTemplate}
            />
            <EditorSidebar />
          </div>
        </div>
      </div>

    </>
  );
}