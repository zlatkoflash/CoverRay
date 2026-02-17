import MobileHeader from "@/components/headers/MobileHeader";
import MobilePreviewMagazzine from "./MobilePreviewMagazzine";
import MobileMainProducts from "./MobileMainProducts";
import MobileFrameUpsellProduct from "./MobileFrameUpsellProduct";
import MobileGiftsAddon from "./MobileGiftsAddon";
import MobileDiscountSection from "./MobileDiscountSection";
import MobilePriceSection from "./MobilePriceSection";
import MobilePayOtherSection from "./MobilePayOtherSection";
import FooterCheckoutMobile from "./FooterCheckoutMobile";
import BCMobileMainProducts from "./BigCommerce/BCMobileMainProducts";
import BCMobileGiftsAddon from "./BigCommerce/BCMobileGiftsAddon";
import BCMobileDiscountSection from "./BigCommerce/BCMobileDiscountSection";
import BCMobilePriceSection from "./BigCommerce/BCMobilePriceSection";
import BCMobilePayOtherSection from "./BigCommerce/BCMobilePayOtherSection";
import BCFooterCheckoutMobile from "./BigCommerce/BCFooterCheckoutMobile";

export default function CheckoutMobileContentBC() {
  return <>
    <MobileHeader />
    <div className="screens-container">
      <div className="screen active">
        <div className="checkout-scroll">
          {
            // <ContentHomeMobile />
          }
          <MobilePreviewMagazzine />
          {/* <MobileMainProducts /> */}
          <BCMobileMainProducts />
          {
            // <MobileFrameUpsellProduct />
          }
          {
            // <MobileGiftsAddon />
          }
          <BCMobileGiftsAddon />
          {
            // <MobileDiscountSection />
          }
          <BCMobileDiscountSection />
          {
            // <MobilePriceSection />
          }
          <BCMobilePriceSection />
          {
            // <MobilePayOtherSection />
          }
          <BCMobilePayOtherSection />
        </div>
      </div>
    </div>


    {/* <FooterCheckoutMobile /> */}
    <BCFooterCheckoutMobile />
  </>;
}