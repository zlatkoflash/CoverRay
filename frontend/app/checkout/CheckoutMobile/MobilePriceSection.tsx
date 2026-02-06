"use client";

import { RootState } from "@/lib/store";
import { INDEX_DB_TEMPLATE_REF_FOR_PAYMENT, LS_GetTemplateFromIndexDB } from "@/utils/editor-local-storage";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { SavingTotal, ShopTotal, ShopTotalShipping } from "@/lib/features/shop/shopSlice";

export default function MobilePriceSection() {
  const [thumbnail, setThumbnail] = useState<string>("");
  const shopState = useSelector((state: RootState) => state.shop);

  // Match the Desktop sorting logic
  const selectedProducts = [...shopState.cardProductsItems].sort(
    (a, b) => a.default_price.unit_amount - b.default_price.unit_amount
  );

  useEffect(() => {
    const loadPreview = async () => {
      const data = await LS_GetTemplateFromIndexDB(INDEX_DB_TEMPLATE_REF_FOR_PAYMENT);
      if (data?.thumbnailDataUrl) {
        setThumbnail(data.thumbnailDataUrl);
      }
    };
    loadPreview();
  }, []);

  const totalShipping = ShopTotalShipping(shopState);
  const savings = SavingTotal(shopState);
  const total = ShopTotal(shopState);

  return (
    <div className="checkout-section price-section">
      {/* Dynamic Product List */}
      {selectedProducts.map((item) => (
        <div key={item.id} className="price-row">
          <span>{item.name}</span>
          <span>${(item.default_price.unit_amount / 100).toFixed(2)}</span>
        </div>
      ))}

      {/* Shipping Row - Only shows if there is a cost */}
      {totalShipping > 0 && (
        <div className="price-row shipping-row" id="shippingRow">
          <span>Shipping</span>
          <span id="shippingPrice">${totalShipping.toFixed(2)}</span>
        </div>
      )}

      {/* Total Row */}
      <div className="price-row total">
        <span>Total</span>
        <span id="totalPrice">${total.toFixed(2)}</span>
      </div>

      {/* Savings Badge - Only shows if saving > 0 */}
      {savings > 0 && (
        <div className="savings-badge" id="savingsBadge" style={{ display: 'block' }}>
          🎉 You're saving <span id="savingsAmount">${savings.toFixed(2)}</span>!
        </div>
      )}
    </div>
  );
}