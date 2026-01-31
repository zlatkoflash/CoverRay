"use client";

import TemplateSelection from "@/components/grids/TemplateSelection";
import HeaderWrap from "@/components/headers/HeadeWrap";
import SidebarLayouts from "@/components/Sidebars/Layouts/Index";
import { useDevice } from "@/Providers/DeviceProvider";


export default function HomePageContent() {

  const { isMobile } = useDevice();

  return (
    <>
      {isMobile ? (
        <>
          this will be the mobile content
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