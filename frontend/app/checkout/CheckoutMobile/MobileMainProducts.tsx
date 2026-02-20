"use client";

import { RootState } from "@/lib/store";
import { useDispatch, useSelector } from "react-redux";
import { shopActions } from "@/lib/features/shop/shopSlice"; // Adjust path to your shopActions

export default function MobileMainProducts() {
  const dispatch = useDispatch();

  // Data from Store
  const products = useSelector((state: RootState) => state.shop.products);
  const PRODUCTS = products?.main_products || [];
  const cartProductsItems = useSelector((state: RootState) => state.shop.cardProductsItems);

  const handleSelect = (product: any) => {
    // Because this is a "Required" Main Product section, 
    // we typically want to replace the existing main product with the new selection.

    // Step 1: Remove any other "Main Products" already in cart if necessary 
    // (Optional: depending on if your logic allows multiple main products)

    // Step 2: Add the selected product
    const isAlreadyInCart = cartProductsItems.some((item) => item.id === product.id);

    if (isAlreadyInCart) {
      dispatch(shopActions.removeProductFromCard(product.id));
    } else {
      dispatch(shopActions.addProductToCard(product));
    }
  };

  return (
    <div className="checkout-section">
      <div className="checkout-section-title">
        <span>Choose Your Product</span>
        <span className="required-badge">Required</span>
      </div>

      <div className="products-container">
        {PRODUCTS.map((product) => {
          const isSelected = cartProductsItems.some((item) => item.id === product.id);
          const price = (product.default_price?.unit_amount / 100).toFixed(2);

          return (
            <div
              key={product.id}
              className={`product-card ${isSelected ? "selected" : ""}`}
              onClick={() => handleSelect(product)}
            >
              {/* Radio/Checkbox Circle */}
              <div className={`product-radio ${isSelected ? "selected" : ""}`}>
                {isSelected && <div className="radio-inner-dot" />}
              </div>

              {/* Icon from Metadata */}
              <div className="product-icon">
                {product.metadata?.icon || "📦"}
              </div>

              <div className="product-info">
                <div className="product-name">
                  {product.name}
                  {product.metadata?.badge && (
                    <span className={`${product.metadata.badge.toLowerCase()}-badge`}>
                      {product.metadata.badge}
                    </span>
                  )}
                </div>
                <div className="product-desc">{product.description}</div>

                {/* Dynamic Options - Rendered if product has options metadata */}
                {isSelected && product.metadata?.hasOptions && (
                  <div className="product-options" onClick={(e) => e.stopPropagation()}>
                    <select
                      className="option-select"
                      onChange={(e) => {
                        // Logic to handle option change (e.g. updating price/metadata)
                        console.log(`Update ${product.name} option to:`, e.target.value);
                      }}
                    >
                      <option value="default">Standard size</option>
                      <option value="upgraded">Upgraded (+$15.00)</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="product-price">${price}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}