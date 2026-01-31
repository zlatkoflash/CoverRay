import EditorCanvasFinal from "@/components/Editor/EditorCanvasFinal";
import EditorHydrator from "@/components/Editor/EditorHydrator";
import Header from "@/components/headers/Header";
import EditorSidebar from "@/components/Sidebars/EditorSidebar/Index";
// import BtnSaveForPaymentPurposes from "@/components/SpecialButtons/BtnSaveForPaymentPurposes";
import { allEditorFontVariables } from "@/lib/fonts";
import { getApiData } from "@/utils/api";
import { ITemplate } from "@/utils/interfaceDatabase";
import dynamic from "next/dynamic";
import BtnSaveForPaymentPurposesWrap from "./BtnSaveForPaymentPurposesWrap";
import HeaderWrap from "@/components/headers/HeadeWrap";
// import dynamic from "next/dynamic";

// 2. Define the dynamic component OUTSIDE the function
// This ensures it only loads in the browser
/*const BtnSaveForPaymentPurposes = dynamic(
  () => import('@/app/Editor/Template/[template_slug]/BtnSaveForPaymentPurposes'),
  { ssr: false }
);*/

export default async function TemplatePageEditorBySlug({ params }: { params: Promise<{ template_slug: string }> }) {


  const { template_slug } = await params;

  console.log("params.template_slug:", template_slug);

  const template = await getApiData<{
    ok: boolean;
    template: ITemplate;
  }>("/templates/get-template-by-slug", "POST", { template_slug: template_slug }, "not-authorize", "application/json");

  console.log("template:", template);


  return (
    <>
      {/* 1. The silent worker starts loading data in the background */}
      <EditorHydrator
        template={template.template} />

      {
        // <Header customContinueButton={<BtnSaveForPaymentPurposesWrap />} />
      }

      <HeaderWrap />

      <div className={`main-container ${allEditorFontVariables

        }`}>
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