"use client";

import Header from "@/components/headers/Header";
import { useDevice } from "@/Providers/DeviceProvider";
import MainProducts from "./MainProducts";
import AsideCheckout from "./AsideCheckout";
import CheckoutMobileContent from "./CheckoutMobile/Index";
import MainProductsBC from "./MainProductsBC";
import AsideCheckoutBC from "./AsideCheckoutBC";
import CheckoutMobileContentBC from "./CheckoutMobile/IndexBC";

export default function DesktopMobileContent() {

  const {
    isMobile
  } = useDevice();

  if (isMobile === true) {
    return <>
      {
        // <CheckoutMobileContent />
      }
      <CheckoutMobileContentBC />
    </>
  }

  return <>
    <Header />

    <div className={`main-container `}>
      <div className="screen active" id="screen2">
        <div className="checkout-layout">
          {
            // <MainProducts />
          }
          <MainProductsBC />
          {/* <AsideCheckout selectedIds={[]} /> */}
          <AsideCheckoutBC selectedIds={[]} />
        </div>
      </div>
    </div>
  </>;
}