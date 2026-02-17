import ZButton from "@/components/buttons/ZButton";
import { authActions, selectIsLoggedIn } from "@/lib/features/auth/authSlice";
import { shopActions, ShopTotal } from "@/lib/features/shop/shopSlice";
import { RootState } from "@/lib/store";
import { useDispatch, useSelector } from "react-redux";

export default function PaymenthButtonsBC() {

  const dispatch = useDispatch();
  const stateShop = useSelector((state: RootState) => state.shop);
  const authState = useSelector((state: RootState) => state.auth);
  const bcState = useSelector((state: RootState) => state.bigCommerce);
  const bcCart = bcState.cart;

  const isLogged = selectIsLoggedIn(authState);

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
    <>
      {
        /*<div className="quick-pay-btns">
        <button className="quick-pay-btn apple">
          <span></span> Pay
        </button>
        <button className="quick-pay-btn">
          <span style={{ fontWeight: 700 }}>G</span> Pay
        </button>
      </div>*/
      }

      {
        // <div className="divider-text">or pay with card</div>
      }

      {
        /*<button className="checkout-btn">
        Complete Order — <span id="checkoutTotal">${total.toFixed(2)}</span>
      </button>*/
      }
      <ZButton
        buttonVariant="checkout-btn"
        onClick={() => {
          console.log("Init the payment");

          ___StartPaymentProcess();

        }}
        // disabled={ShopTotal(stateShop) <= 0}
        disabled={bcCart === null || bcCart.cart_amount <= 0}
      >
        Complete Order — <span id="checkoutTotal">${bcCart?.cart_amount.toFixed(2)}</span>
      </ZButton>
    </>
  );
}