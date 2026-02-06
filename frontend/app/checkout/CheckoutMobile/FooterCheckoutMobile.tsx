"use client";

import { RootState } from "@/lib/store";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { shopActions, ShopTotal } from "@/lib/features/shop/shopSlice";
import Link from "next/link";
import { authActions, selectIsLoggedIn } from "@/lib/features/auth/authSlice";
import { useEffect, useState } from "react";
import { INDEX_DB_TEMPLATE_REF_FOR_PAYMENT, LS_GetTemplateFromIndexDB } from "@/utils/editor-local-storage";
import { ITemplate } from "@/utils/interfaceDatabase";

export default function FooterCheckoutMobile() {
  const router = useRouter();
  const shopState = useSelector((state: RootState) => state.shop);
  const cartItems = shopState.cardProductsItems;

  // 1. Dynamic values from Redux
  const totalAmount = ShopTotal(shopState).toFixed(2);
  const itemCount = cartItems.length;

  const authState = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const isLogged = selectIsLoggedIn(authState);

  const handleCheckout = () => {
    // You can trigger your payment modal or navigate to a specific checkout flow
    console.log("Proceeding to checkout with amount:", totalAmount);
    // showModal('account'); // If you have a modal context
  };

  const handleBack = () => {
    // Navigate back to the Editor (Step 2)
    router.back();
  };

  const [templateDB, setTemplateDB] = useState<ITemplate | null>(null);

  useEffect(() => {
    const __loadTheTempalte = async () => {
      const data = await LS_GetTemplateFromIndexDB(INDEX_DB_TEMPLATE_REF_FOR_PAYMENT);
      setTemplateDB(data?.templateDB || null);


      console.log("data:", data);
    };
    __loadTheTempalte();
  }, []);


  const ___StartPaymentProcess = () => {
    console.log("authState.user:", authState.user);
    if (!isLogged) {
      // open the login modal
      dispatch(authActions.setModalSignInOpen({
        open: true,
        intentAfterSignIn: "CHECKOUT"
      }));
      return;
    }

    dispatch(shopActions.setShowModalCardPayment(true));

    // start the payment process
  }


  return (
    <div className="mobile-footer">
      <div className="footer-info">
        Step 3 of 3 • <span className="highlight" id="itemCount">
          {itemCount} {itemCount === 1 ? 'item' : 'items'}
        </span> in cart
      </div>

      <div className="footer-buttons">
        {
          /* <button className="footer-btn back" onClick={handleBack}>
            ←
          </button>*/
        }
        <Link className="footer-btn back" href={`/Editor/Template/${templateDB?.slug}`} style={{
          textDecoration: "none"
        }}>
          ←
        </Link>

        <button
          className="footer-btn primary"
          onClick={() => {
            ___StartPaymentProcess();
          }}
          style={{
            flex: 1,
            pointerEvents: itemCount === 0 ? "none" : "auto",
            opacity: itemCount === 0 ? 0.5 : 1

          }}
        // disabled={itemCount === 0} // Disable if cart is empty
        >
          Checkout — <span id="footerTotal">${totalAmount}</span>
        </button>

        {
          /*
          <button className="footer-btn save" onClick={() => console.log("Saving for later...")}>
          💾
        </button>
          */
        }
      </div>

      <div className="trust-indicator">
        <span>🔒 Secure checkout</span>
        <span>✓ Money-back guarantee</span>
      </div>
    </div>
  );
}