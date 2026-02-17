"use client";

import { BC_removeFromCart } from "@/lib/bigcommerce/api";
import { LoadBCCart } from "@/lib/bigcommerce/bigCommerceSlice";
import { AppDispatch, RootState } from "@/lib/store";
import { IBCCartItem } from "@/utils/interfacesBigCommerce";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function BCCartItem({ item }: { item: IBCCartItem }) {

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const bcState = useSelector((state: RootState) => state.bigCommerce);
  const bcCartVariants = bcState.cartVariants;

  const currentVariant = bcCartVariants.find((variant) => variant.id === item.variant_id);

  const variationLabel = (
    currentVariant !== undefined ?
      currentVariant.option_values.map((optionValue) => optionValue.label).join(", ")
      : ""

  );


  console.log("Big commerce item:", item);
  console.log("bcCartVariants:", bcCartVariants);

  const RemoveTheItemFromCart = async () => {
    setLoading(true);
    try {
      const result = await BC_removeFromCart(item.id);
      // If result.success is true but cart is null, it means the cart was deleted (last item removed)
      if (result?.success) {
        // syncCartWithState(result.cart || null);
        dispatch(LoadBCCart());

      }
    } catch (err) {
      console.error("Remove error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={`price-row ${item.id === "" ? 'upsell' : ''}`}
      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
    >
      <div>
        <span>
          {
            item.quantity > 1 ? `${item.quantity} x ` : ""
          }
          {item.name}
          {
            variationLabel !== "" ?
              <>
                <br />
                <small>{variationLabel}</small>
              </>
              :
              ""
          }
        </span>
        <span style={{ marginLeft: '10px' }}>
          <strong>${item.sale_price.toFixed(2)}</strong>
        </span>
      </div>

      {/* Remove Item Button */}
      <button
        style={{
          cursor: "pointer"
        }}
        type="button"
        className="remove-item-btn"
        aria-label={`Remove ${item.name}`}
        onClick={() => {

          RemoveTheItemFromCart()

        }}
      >
        &times;
      </button>
    </div>
  );
}