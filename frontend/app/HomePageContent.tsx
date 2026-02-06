"use client";

import TemplateSelection from "@/components/grids/TemplateSelection";
import HeaderWrap from "@/components/headers/HeadeWrap";
import MobileHeader from "@/components/headers/MobileHeader";
import SidebarLayouts from "@/components/Sidebars/Layouts/Index";
import { useDevice } from "@/Providers/DeviceProvider";
import ContentHomeMobile from "./ContentHomeMobile/Index";
import MobileFooterHome from "@/components/footers/MobileFooterHome";


export default function HomePageContent() {

  const { isMobile } = useDevice();

  return (
    <>
      {isMobile ? (
        <>
          <MobileHeader />
          <div className="screens-container">
            <div className="screen active">
              <div className="mobile-content">
                <ContentHomeMobile />
              </div>
            </div>
          </div>

          <MobileFooterHome />
        </>
      ) : (
        <>
          <HeaderWrap />

          <div className="main-container">
            <div className="screen active" id="screen1">
              <div className="selection-layout">
                <SidebarLayouts />
                <TemplateSelection />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}