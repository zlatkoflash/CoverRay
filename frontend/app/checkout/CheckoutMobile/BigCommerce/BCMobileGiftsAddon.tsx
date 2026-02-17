"use client";

import { RootState } from "@/lib/store";
import { useDispatch, useSelector } from "react-redux";
import { shopActions } from "@/lib/features/shop/shopSlice";
import BCProduct from "../../BiCommerceComponents/BCProduct";

export default function BCMobileGiftsAddon() {
  const dispatch = useDispatch();

  // 1. Data from Store
  const products = useSelector((state: RootState) => state.shop.products);
  const ACCESSORIES = products.unique_gifts_products || [];
  const cartProductsItems = useSelector((state: RootState) => state.shop.cardProductsItems);
  const shippingCost = products?.standard_shipping_for_gifts?.[0]?.default_price?.unit_amount / 100 || "6.50";

  const bigCommerceState = useSelector((state: RootState) => state.bigCommerce);
  const GiftsProducts = bigCommerceState.products.filter((product) => product.categories.includes(29));

  const handleToggleGift = (product: any) => {
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
        <span>Unique Gift Add-ons</span>
        <span className="save-tag">Ships Separately</span>
      </div>

      {
        /*<div className="upsell-grid">
        {ACCESSORIES.map((product) => {
          const isSelected = cartProductsItems.some((item) => item.id === product.id);
          const price = (product.default_price?.unit_amount / 100).toFixed(2);
          const hasSizes = product.metadata?.hasSizes === "true";

          return (
            <div
              key={product.id}
              className={`upsell-mini-card ${isSelected ? "selected" : ""}`}
              onClick={() => handleToggleGift(product)}
            >
              <div className={`mini-checkbox ${isSelected ? "checked" : ""}`}>
                {isSelected && <div className="check-inner" />}
              </div>

              <div className="mini-icon">{product.metadata?.icon || "🎁"}</div>
              <div className="mini-name">{product.name}</div>
              <div className="mini-price">${price}</div>

              
              {hasSizes && isSelected && (
                <select
                  className="mini-select"
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => {
                    // You can dispatch an update to the item metadata in the cart here
                    console.log(`Size selected for ${product.name}:`, e.target.value);
                  }}
                >
                  <option value="">Size</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                </select>
              )}
            </div>
          );
        })}
      </div>*/
      }

      <div className="accessories-grid">
        {
          GiftsProducts.map((product) => (
            <BCProduct key={product.id} product={product} type="gift-product" />
          ))
        }
      </div>

      <div className="shipping-note">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
        Accessories ship separately (+${shippingCost} shipping each)
      </div>
    </div>
  );
}