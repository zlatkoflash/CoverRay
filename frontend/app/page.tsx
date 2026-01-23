import TemplateSelection from "@/components/grids/TemplateSelection";
import Header from "@/components/headers/Header";
import SidebarLayouts from "@/components/Sidebars/Layouts/Index";
import { getApiData } from "@/utils/api";
import HomePageHydration from "./pageHydration";
// import BtnSaveForPaymentPurposes from "@/app/Editor/Template/[template_slug]/BtnSaveForPaymentPurposes";

export default async function Home() {



  return (
    <>
      <HomePageHydration />
      <Header />

      <div className="main-container">
        <div className="screen active" id="screen1">
          <div className="selection-layout">
            <SidebarLayouts />
            <TemplateSelection />
          </div>
        </div>
      </div>

    </>
  );
}