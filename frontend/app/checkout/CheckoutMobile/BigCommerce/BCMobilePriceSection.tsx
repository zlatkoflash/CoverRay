"use client";

import { RootState } from "@/lib/store";
import { INDEX_DB_TEMPLATE_REF_FOR_PAYMENT, LS_GetTemplateFromIndexDB } from "@/utils/editor-local-storage";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { SavingTotal, ShopTotal, ShopTotalShipping } from "@/lib/features/shop/shopSlice";
import { IBCCartItem } from "@/utils/interfacesBigCommerce";
import BCCartItem from "../../BiCommerceComponents/BCCartItem";

export default function BCMobilePriceSection() {
  const [thumbnail, setThumbnail] = useState<string>("");
  const shopState = useSelector((state: RootState) => state.shop);


  const bigCommerceState = useSelector((state: RootState) => state.bigCommerce);
  const cartBC = bigCommerceState.cart;

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

  if (cartBC === null) return null;

  let totalItems: IBCCartItem[] = [];
  if (cartBC === null) {
    totalItems = [];
  } else {
    totalItems = [...cartBC.line_items.digital_items, ...cartBC.line_items.physical_items];
  }

  return (
    <div className="checkout-section price-section">
      {/* Dynamic Product List */}
      {
        // selectedProducts.map((item) => (
        totalItems.map((item: IBCCartItem, index: number) => (
          <BCCartItem item={item} key={index + '-' + item.id} />
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
        <span id="totalPrice">${cartBC?.cart_amount.toFixed(2)}</span>
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