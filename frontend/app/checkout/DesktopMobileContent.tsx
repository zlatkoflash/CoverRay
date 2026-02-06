"use client";

import Header from "@/components/headers/Header";
import { useDevice } from "@/Providers/DeviceProvider";
import MainProducts from "./MainProducts";
import AsideCheckout from "./AsideCheckout";
import CheckoutMobileContent from "./CheckoutMobile/Index";

export default function DesktopMobileContent() {

  const {
    isMobile
  } = useDevice();

  if (isMobile === true) {
    return <>
      <CheckoutMobileContent />
    </>
  }

  return <>
    <Header />

    <div className={`main-container `}>
      <div className="screen active" id="screen2">
        <div className="checkout-layout">
          <MainProducts />
          <AsideCheckout selectedIds={[]} />
        </div>
      </div>
    </div>
  </>;
}