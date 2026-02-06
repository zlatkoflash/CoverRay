"use client"

import EditorCanvasFinal from "@/components/Editor/EditorCanvasFinal";
import HeaderWrap from "@/components/headers/HeadeWrap";
import MobileHeader from "@/components/headers/MobileHeader";
import EditorSidebar from "@/components/Sidebars/EditorSidebar/Index";
// import { allEditorFontVariables } from "@/lib/fonts";
import { useDevice } from "@/Providers/DeviceProvider";
import MobileButtonUploadPhoto from "./MobileButtonUploadPhoto";
import MobileFooterEditor from "@/components/footers/MobileFooterEditor";

export default function EditorTemplateDesktopMobile() {

  const {
    isMobile
  } = useDevice();

  if (isMobile === true)
    return <>
      <MobileHeader />
      <div className="screen active">
        <div className="editor-canvas">
          {
            // <MobileButtonUploadPhoto />
          }
          <EditorCanvasFinal
          // template={exampleJSONTemplate}
          />
        </div>

      </div>

      <MobileFooterEditor />
    </>

  return (
    <>
      <HeaderWrap />

      <div className={`main-container `}>
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