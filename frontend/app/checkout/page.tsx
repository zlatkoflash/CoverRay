import Header from "@/components/headers/Header";
import MainProducts from "./MainProducts";
import AsideCheckout from "./AsideCheckout";
import { getApiData } from "@/utils/api";
import { IStripeProduct } from "@/utils/interfacesStripe";
import HydrateTheShop from "./HydrateTheShop";

export default async function CheckoutPage() {

  const products = await getApiData<{
    ok: boolean;
    products: {
      main_products: IStripeProduct[];
      frames_products: IStripeProduct[];
      unique_gifts_products: IStripeProduct[];
      standard_shipping_for_gifts: IStripeProduct[];
    }
  }>("/stripe/get-products", "POST", {}, "not-authorize", "application/json")
  console.log("products", products);
  console.log("products.products.standard_shipping_for_gifts", products.products.standard_shipping_for_gifts[0].default_price.unit_amount / 100);

  return <>

    <HydrateTheShop shopState={{
      products: products.products,
      cardProductsItems: [],
      selectedStandardShipForGifts: null,
      showModalCardPayment: false,
      paymentProcessingStatus: "idle",
      paymentProcessingMessage: "",
    }} />

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