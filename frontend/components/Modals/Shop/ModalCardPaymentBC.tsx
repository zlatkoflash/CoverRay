"use client";

import ZButton from "@/components/buttons/ZButton";
import { authActions } from "@/lib/features/auth/authSlice";
import { RootState } from "@/lib/store";
import { getApiData } from "@/utils/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { createClient } from "@/utils/supabase";
import { GetShippingProductForGiftProducts, shopActions, ShopTotal } from "@/lib/features/shop/shopSlice";
import { INDEX_DB_TEMPLATE_COVER_FINAL_FOR_PAYMENT, INDEX_DB_TEMPLATE_PDF_FINAL_FOR_PAYMENT, INDEX_DB_TEMPLATE_REF_FOR_PAYMENT, LS_GetBlobFromIndexDB, LS_GetTemplateFromIndexDB } from "@/utils/editor-local-storage";
import { uploadTempFile } from "@/utils/files";
import { IStripeCustomer, IStripePaymentIntent } from "@/utils/interfacesStripe";
import { BC_CompleteOrderFromCart, BC_getCart, BC_GetOrCreateUserByEmail } from "@/lib/bigcommerce/api";
import { IBCCartItem, IBCCustomer } from "@/utils/interfacesBigCommerce";

export default function ModalCardPayment() {
  const clientSupabase = createClient();
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();

  const [nameOnCard, setNameOnCard] = useState("");

  const dispatch = useDispatch();
  const authState = useSelector((state: RootState) => state.auth);
  const shopState = useSelector((state: RootState) => state.shop);
  const processingStatus = shopState.paymentProcessingStatus;
  const bigCommerceState = useSelector((state: RootState) => state.bigCommerce);
  const cartBigCommerce = bigCommerceState.cart;

  // 1. IMPORTANT: Specific style object for Stripe Internal Iframe
  const elementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#444',
        fontFamily: 'Inter, sans-serif',
        '::placeholder': {
          color: '#9ca3af',
        },
      },
      invalid: {
        color: '#ef4444',
      },
    },
  };

  const ___StartPayment = async () => {

    //debugging
    /*const details = await getApiData<{ error: boolean; ok: boolean; errorMessage: string; }>(`/orders-private/health`, "GET", {}, "authorize", "application/json");
    console.log("details health private api", details);
    return;*/


    if (!stripe || !elements) return;
    dispatch(shopActions.setPaymentProcessingStatus("processing"));


    // create the customer if not exist in bigcommerce
    const customerBCData = await BC_GetOrCreateUserByEmail(
      authState.user?.email as string,
      authState.user?.email.split("@")[0],
      "",
    );
    console.log("customerBCData:", customerBCData);
    if (customerBCData.success !== true) {
      dispatch(shopActions.setPaymentProcessingStatus("error"));
      dispatch(shopActions.setPaymentProcessingMessage("Error creating / generating user in BC. Please try again later."));
      return;
    }
    const bcCustomer = customerBCData.customer as IBCCustomer;


    const cardElement = elements.getElement(CardNumberElement);
    if (!cardElement) return;

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
      billing_details: { name: nameOnCard },
    });
    // paymentMethod.
    console.log("paymentMethod", paymentMethod);
    console.log("error", error);

    /**
     * Getting the blobs for pdf and image
     */
    const blobImage = await LS_GetBlobFromIndexDB(INDEX_DB_TEMPLATE_COVER_FINAL_FOR_PAYMENT);
    const blobPDF = await LS_GetBlobFromIndexDB(INDEX_DB_TEMPLATE_PDF_FINAL_FOR_PAYMENT);
    if (blobImage === null) {
      // const uploadImage = await uploadTempFile(blobImage, "png");
      dispatch(shopActions.setPaymentProcessingStatus("error"));
      dispatch(shopActions.setPaymentProcessingMessage("Image not found"));
      return;
    }
    if (blobPDF === null) {
      // const uploadPDF = await uploadTempFile(blobPDF, "pdf");
      dispatch(shopActions.setPaymentProcessingStatus("error"));
      dispatch(shopActions.setPaymentProcessingMessage("PDF not found"));
      return;
    }
    // the blobs exist let's save them now to supabase temporary folder
    const uploadedImageData = await uploadTempFile(
      blobImage,
      "jpeg",
    )
    const uploadedPDFData = await uploadTempFile(
      blobPDF,
      "pdf",
    )
    console.log("uploadedImageData", uploadedImageData);
    console.log("uploadedPDFData", uploadedPDFData);
    // uploadedImageData.


    // after check if the logged user is customer in our stripe, if it is not create it.
    const stripeCustomerInfo = await getApiData<{
      error: boolean; ok: boolean; errorMessage: string;
      stripeCustomer: IStripeCustomer | null;
    }>(`/stripe/get-stripe-customer`, "POST", {
      email: authState.user?.email,
      // name: authState.user?.name,
    }, "authorize", "application/json");
    console.log("stripeCustomerInfo", stripeCustomerInfo);
    if (!stripeCustomerInfo.stripeCustomer) {
      dispatch(shopActions.setPaymentProcessingStatus("error"));
      dispatch(shopActions.setPaymentProcessingMessage("Stripe customer not found / error creating customer"));
      return;
    }


    if (error) {
      dispatch(shopActions.setPaymentProcessingStatus("error"));
      dispatch(shopActions.setPaymentProcessingMessage(error.message || "Payment failed"));
      return;
    }

    // const priceShipping = shopState.selectedStandardShipForGifts[0]?.price;
    /*const ProductsForIntent = shopState.cardProductsItems.map((item) => item.id);
    console.log("shopState.selectedStandardShipForGifts", shopState.selectedStandardShipForGifts);
    const shippingProduct = GetShippingProductForGiftProducts(shopState);
    if (shippingProduct) {
      ProductsForIntent.push(shippingProduct.id);
    }*/

    const totalFromCart = cartBigCommerce?.cart_amount as number;
    // now we load again the cart to check if the cart_amount is same if it is not same we trow error and we go back
    const cartReloaded = await BC_getCart();
    if (cartReloaded === null || cartReloaded.cart_amount !== totalFromCart) {
      dispatch(shopActions.setPaymentProcessingStatus("error"));
      dispatch(shopActions.setPaymentProcessingMessage("Cart amount changed. Please refresh the page and try again."));
      return;
    }

    // let orderSummary = '';
    /*cartBigCommerce?.line_items..map((item) => {
      orderSummary += `${item.name} x ${item.quantity}\n`;
    });*/
    /*if (cartBigCommerce?.shipping_cost) {
      orderSummary += `Shipping x ${cartBigCommerce.shipping_cost}\n`;
    }
    if (cartBigCommerce?.tax_cost) {
      orderSummary += `Tax x ${cartBigCommerce.tax_cost}\n`;
    }*/
    let totalCartItems: IBCCartItem[] = [
      // ...cartBigCommerce?.line_items,
      ...(cartBigCommerce?.line_items.digital_items as IBCCartItem[]),
      ...(cartBigCommerce?.line_items.physical_items as IBCCartItem[]),
      // ...cartBigCommerce?.service_line_items,
    ];
    const cartSummaryText: string = totalCartItems
      .map((item) => `${item.name} (x${item.quantity})`)
      .join('; ');


    // cartBigCommerce?.line_items.

    // now we pay to stripe
    const payloadForIntent = {
      // amount: 1000,
      currency: "usd",
      customerId: stripeCustomerInfo.stripeCustomer.id,
      paymentMethodId: paymentMethod.id,
      // productsIds: ProductsForIntent,
      productsIds: [],

      // amount100: ShopTotal(shopState) * 100
      amount100: totalFromCart * 100,

      orderSummary: cartSummaryText
    };
    console.log("payloadForIntent:", payloadForIntent);
    const stripePaymentInfo = await getApiData<{ error: boolean; ok: boolean; message: string; paymentIntentData: IStripePaymentIntent }>(`/stripe/create-payment-intent`, "POST", payloadForIntent, "authorize", "application/json");
    console.log("stripePaymentInfo", stripePaymentInfo);

    if (!stripePaymentInfo.ok) {
      dispatch(shopActions.setPaymentProcessingStatus("error"));
      dispatch(shopActions.setPaymentProcessingMessage(stripePaymentInfo.message));
      return;
    }
    // const stripePaymentIntent = stripePaymentInfo.data as IStripePaymentIntent;
    console.log("stripePaymentIntent", stripePaymentInfo.paymentIntentData);
    if (stripePaymentInfo.paymentIntentData.status === "succeeded") { }
    else if (stripePaymentInfo.paymentIntentData.status === "requires_action") {

      // 2. Use the client_secret to trigger the 3D Secure modal
      const { error, paymentIntent: confirmedIntent } = await stripe.confirmCardPayment(
        stripePaymentInfo.paymentIntentData.client_secret
      );

      if (error) {
        // User closed the popup or authentication failed
        // dispatch(shopActions.setPaymentProcessingMessage(error?.message?.message as string));
        dispatch(shopActions.setPaymentProcessingMessage(error?.message as string));
        console.log("error?.message:", error?.message);
        dispatch(shopActions.setPaymentProcessingStatus("error"));
        console.log("error", error, "3D secure confirmed error.");
        return;
      } else if (confirmedIntent.status === "succeeded") {
        // ✅ Authentication successful, payment complete!
        // router.push("/success");
      }

    }
    else {
      dispatch(shopActions.setPaymentProcessingStatus("error"));
      dispatch(shopActions.setPaymentProcessingMessage(`Payment failed: ${stripePaymentInfo.paymentIntentData.status}`));
      return;
    }


    const editedTemplateDetails = await LS_GetTemplateFromIndexDB(INDEX_DB_TEMPLATE_REF_FOR_PAYMENT);
    console.log('editedTemplateDetails:', editedTemplateDetails);
    /**
     * Saving the order, 
     * user must be logged this to happen
     */
    const payloadForDoingTheOrder = {
      pdf: uploadedPDFData,
      image: uploadedImageData,

      paymentMethod: paymentMethod,
      stripeCustomer: stripeCustomerInfo.stripeCustomer,
      paymentIntent: stripePaymentInfo.paymentIntentData,

      // templateId: editedTemplateDetails?.template.id
      templateId: editedTemplateDetails?.templateDB.id
    };
    console.log("payloadForDoingTheOrder:", payloadForDoingTheOrder);
    console.log("Finally we are here, we can send the products to the user.");
    const SavingTheOrder = await getApiData<{ error: boolean; ok: boolean; errorMessage: string; }>(`/orders-private/create-the-order`, "POST", payloadForDoingTheOrder, "authorize", "application/json");
    console.log("SavingTheOrder:", SavingTheOrder);


    console.log("Billing / Shipping Details must be set for the user for bigcommerce");
    const resultCreateBigCommerceOrder = await BC_CompleteOrderFromCart(
      cartBigCommerce?.id as string,
      bcCustomer.id,
      {
        firstName: "John",
        lastName: "Doe",
        address1: "123 Main St",
        city: "New York",
        state: "New York",
        zip: "10001",
        country: "United States",
        email: authState.user?.email as string
      }
    );
    console.log("resultCreateBigCommerceOrder:", resultCreateBigCommerceOrder);



    dispatch(shopActions.setPaymentProcessingStatus("success"));


    // authActions.setLogingProcessingStatus
    // shopActions.


    /*const paymentDetails = await getApiData<{
      error: boolean; ok: boolean; errorMessage: string;
    }>("/payments/process", "POST", {
      paymentMethodId: paymentMethod.id,
      amount: 1000,
    }, "not-authorize", "application/json");

    if (paymentDetails.ok) {
      dispatch(authActions.setLogingProcessingStatus("success"));
      dispatch(shopActions.setShowModalCardPayment(false));
      router.refresh();
    } else {
      dispatch(authActions.setLogingProcessingStatus("error"));
      dispatch(authActions.setLogingProcessingMessage(paymentDetails.errorMessage));
    }*/
  };

  const ___CreateTestUser = async () => {
    const user = await BC_GetOrCreateUserByEmail("test@test.com", "Test", "User");
    console.log("user:", user);
  };

  return (
    <div className={`modal-overlay ${shopState.showModalCardPayment ? "visible" : ""}`} id="accountModal">
      <div
        className="click-for-closing-area"
        style={{ zIndex: -1, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'transparent' }}
        onClick={() => { dispatch(shopActions.setShowModalCardPayment(false)) }}
      ></div>

      <div className="modal-content">
        <div className="modal-icon account">💳</div>
        <div className="modal-title">Secure Payment</div>
        <div className="modal-message">Enter your card details to complete your purchase</div>

        <div className="divider-text">Payment Information</div>

        {/* Name Input */}
        <input
          type="text"
          className="modal-input"
          placeholder="Name on Card"
          value={nameOnCard}
          onChange={(e) => setNameOnCard(e.target.value)}
        />

        {/* 2. Card Number Wrapper - Added explicit padding and min-height */}
        <div className="modal-input" style={{ padding: '15px', minHeight: '50px' }}>
          <CardNumberElement options={elementOptions} />
        </div>

        <div className="modal-input-group" style={{ display: 'flex', gap: '10px' }}>
          {/* 3. Expiry Wrapper */}
          <div className="modal-input" style={{ flex: 1, padding: '15px', minHeight: '50px' }}>
            <CardExpiryElement options={elementOptions} />
          </div>
          {/* 4. CVC Wrapper */}
          <div className="modal-input" style={{ flex: 1, padding: '15px', minHeight: '50px' }}>
            <CardCvcElement options={elementOptions} />
          </div>
        </div>

        <div className="modal-actions">
          <ZButton
            buttonVariant="modal-btn primary"
            loading={processingStatus === "processing"}
            onClick={() => { ___StartPayment() }}
          >
            Pay Now
          </ZButton>
          {
            /*<ZButton
            buttonVariant="modal-btn primary"
            loading={processingStatus === "processing"}
            // works, it is creating user
            onClick={() => { ___CreateTestUser() }}
          >
            Create test user
          </ZButton>*/
          }

          {processingStatus === "error" && (
            <div className="modal-error" style={{ marginTop: '10px', color: '#ef4444' }}>
              {shopState.paymentProcessingMessage}
            </div>
          )}

          <div className="divider-text" style={{ fontSize: '12px', opacity: 0.7 }}>
            🔒 Your payment information is encrypted and secure.
          </div>

          <button className="modal-btn secondary" onClick={() => {
            dispatch(shopActions.setShowModalCardPayment(false));
          }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}