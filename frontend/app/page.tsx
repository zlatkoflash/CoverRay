// import TemplateSelection from "@/components/grids/TemplateSelection";
// import TemplateSelection from "@/components/grids/TemplateSelection";
import Header from "@/components/headers/Header";
import SidebarLayouts from "@/components/Sidebars/Layouts/Index";
import { getApiData } from "@/utils/api";
import HomePageHydration from "./pageHydration";
import HeaderWrap from "@/components/headers/HeadeWrap";
import HomePageContent from "./HomePageContent";
// import BtnSaveForPaymentPurposes from "@/app/Editor/Template/[template_slug]/BtnSaveForPaymentPurposes";

export default async function Home() {



  return (
    <>
      <HomePageHydration />

      <HomePageContent />

    </>
  );
}