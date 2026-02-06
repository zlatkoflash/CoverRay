import MobileHeader from "@/components/headers/MobileHeader";
import MobilePreviewMagazzine from "./MobilePreviewMagazzine";
import MobileMainProducts from "./MobileMainProducts";
import MobileFrameUpsellProduct from "./MobileFrameUpsellProduct";
import MobileGiftsAddon from "./MobileGiftsAddon";
import MobileDiscountSection from "./MobileDiscountSection";
import MobilePriceSection from "./MobilePriceSection";
import MobilePayOtherSection from "./MobilePayOtherSection";
import FooterCheckoutMobile from "./FooterCheckoutMobile";

export default function CheckoutMobileContent() {
  return <>
    <MobileHeader />
    <div className="screens-container">
      <div className="screen active">
        <div className="checkout-scroll">
          {
            // <ContentHomeMobile />
          }
          <MobilePreviewMagazzine />
          <MobileMainProducts />
          <MobileFrameUpsellProduct />
          <MobileGiftsAddon />
          <MobileDiscountSection />
          <MobilePriceSection />
          <MobilePayOtherSection />
        </div>
      </div>
    </div>


    <FooterCheckoutMobile />
  </>;
}