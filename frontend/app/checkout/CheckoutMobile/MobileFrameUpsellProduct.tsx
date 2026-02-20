"use client";

import { RootState } from "@/lib/store";
import { useDispatch, useSelector } from "react-redux";
import { shopActions } from "@/lib/features/shop/shopSlice";

export default function MobileFrameUpsellProduct() {
  const dispatch = useDispatch();

  // 1. Get products and cart from Redux
  const products = useSelector((state: RootState) => state.shop.products);
  const UPSELLS = products?.frames_products || [];
  const cartProductsItems = useSelector((state: RootState) => state.shop.cardProductsItems);

  const handleToggleUpsell = (product: any) => {
    const isSelected = cartProductsItems.some((item) => item.id === product.id);

    if (isSelected) {
      dispatch(shopActions.removeProductFromCard(product.id));
    } else {
      dispatch(shopActions.addProductToCard(product));
    }
  };

  return (
    <div className="checkout-section upsell-section">
      <div className="checkout-section-title">
        <span>Add a Frame</span>
        <span className="save-tag">Complete the Look</span>
      </div>

      <div className="upsell-container">
        {UPSELLS.map((product) => {
          const isSelected = cartProductsItems.some((item) => item.id === product.id);

          // Price calculation (assuming unit_amount is in cents)
          const salePrice = product.default_price?.unit_amount / 100;
          // Original price calculation (e.g., if you have it in metadata or just add 25%)
          const originalPrice = product.metadata?.originalPrice
            ? parseFloat(product.metadata.originalPrice)
            : salePrice + 20;

          return (
            <div
              key={product.id}
              className={`upsell-card ${isSelected ? "selected" : ""}`}
              onClick={() => handleToggleUpsell(product)}
            >
              {/* Checkbox Icon */}
              <div className={`upsell-checkbox ${isSelected ? "checked" : ""}`}>
                {/*
                it is working with :after
                isSelected && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                )*/}
              </div>

              <div className="upsell-icon">
                {product.metadata?.icon || "🖼️"}
              </div>

              <div className="upsell-info">
                <div className="upsell-name">{product.name}</div>
                <div className="upsell-desc">{product.description}</div>
              </div>

              <div className="upsell-price">
                <span className="upsell-original">${originalPrice.toFixed(2)}</span>
                <span className="upsell-sale">${salePrice.toFixed(2)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}