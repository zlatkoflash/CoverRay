"use client";

import { shopActions } from "@/lib/features/shop/shopSlice";
import { RootState } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

export default function ModalOrderSuccess() {
  const router = useRouter();
  const dispatch = useDispatch();

  const shopState = useSelector((state: RootState) => state.shop);
  const isVisible = shopState.paymentProcessingStatus === "success";

  /**
   * Manual Scalable Reset:
   * Clears all session data and redirects the user.
   */
  const handleFinalize = (path: string) => {
    dispatch(shopActions.setPaymentProcessingStatus("idle"));
    dispatch(shopActions.setShowModalCardPayment(false));
    dispatch(shopActions.clearCardProductsItems());

    // Refresh ensures any server-side data is synced
    router.refresh();
    router.push(path);
  };

  return (
    <div className={`modal-overlay ${isVisible ? "visible" : ""}`} id="successModal">
      {/* Invisible layer for closing by clicking outside */}
      <div
        className="click-for-closing-area"
        style={{
          zIndex: -1,
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "transparent",
        }}
        onClick={() => handleFinalize("/")}
      ></div>

      <div className="modal-content">
        <div className="modal-icon success">🎉</div>
        <div className="modal-title">Order Complete!</div>
        <div className="modal-message">
          Your custom Dogue magazine is on its way! Check your email for confirmation.
        </div>

        <div className="modal-actions">
          {/* View Order: Redirect to account or orders page */}
          <button
            className="modal-btn primary"
            onClick={() => handleFinalize("/account/orders")}
          >
            View Order
          </button>

          {/* Create Another: Redirect to home/editor */}
          <button
            className="modal-btn text"
            onClick={() => handleFinalize("/")}
          >
            Create Another
          </button>
        </div>
      </div>
    </div>
  );
}