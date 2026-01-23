"use client";

import { shopActions } from '@/lib/features/shop/shopSlice';
import { RootState } from '@/lib/store';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Define the data structure
/*const PRODUCTS = [
  { id: 'digital', icon: '📱', name: 'Digital Download', desc: 'High-res JPG file delivered instantly via email', price: 9.95, badge: null },
  { id: 'print', icon: '🖼️', name: 'Photo Print', desc: '8" x 10" glossy photo print • Multi-print 50% off', price: 15.00, badge: 'Popular' },
  { id: 'poster', icon: '📜', name: 'Poster Print', desc: '16" x 20" professional matte finish', price: 35.00, badge: null },
  { id: 'canvas', icon: '🎨', name: 'Canvas Print', desc: 'Mounted on hardwood frame • 16x20 or 24x30', price: 64.95, badge: 'Premium' },
];*/

/*const UPSELLS = [
  { id: 'frame', icon: '🖼️', name: 'Matted Frame', desc: 'Custom black wood frame with 2" white mat', price: 59.50, originalPrice: 79.00 },
];*/

/*const ACCESSORIES = [
  { id: 'mug', icon: '☕', name: 'Mug', price: 19.95 },
  { id: 'mousepad', icon: '🖱️', name: 'Mouse Pad', price: 16.95 },
  { id: 'tshirt', icon: '👕', name: 'T-Shirt', price: 19.95 },
];*/

export default function MainProducts() {

  const products = useSelector((state: RootState) => state.shop.products);
  const PRODUCTS = products.main_products;
  const UPSELLS = products.frames_products;
  const ACCESSORIES = products.unique_gifts_products;
  const dispatch = useDispatch();
  const standard_shipping_for_gifts = products.standard_shipping_for_gifts;
  console.log("standard_shipping_for_gifts inside store:", standard_shipping_for_gifts);

  const cartProductsItems = useSelector((state: RootState) => state.shop.cardProductsItems);
  console.log("cartProductsItems inside store:", cartProductsItems);

  console.log(ACCESSORIES, "ACCESSORIES", "cartProductsItems:", cartProductsItems);


  // State to track all selected IDs
  // const [selectedIds, setSelectedIds] = useState<string[]>(['digital']);

  /*const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };*/


  if (standard_shipping_for_gifts.length === 0) {
    console.log("standard_shipping_for_gifts is empty, it must have values for the gifts products");
    return null;
  }

  return (
    <main className="checkout-main">
      {/* 1. MAIN PRODUCTS SECTION */}
      <div className="checkout-section">
        <div className="checkout-section-title">
          <span>Choose Your Products</span>
          <span className="required-badge">Select one or more</span>
        </div>

        {PRODUCTS.map((product) => (
          <div
            key={product.id}
            className={`product-card ${cartProductsItems.some((item) => item.id === product.id) ? 'selected' : ''}`}
            onClick={() => {
              // toggleSelection(product.id);
              if (cartProductsItems.some((item) => item.id === product.id)) {
                dispatch(shopActions.removeProductFromCard(product.id));
              } else {
                dispatch(shopActions.addProductToCard(product));
              }
            }}
          >
            <div className={`product-checkbox ${cartProductsItems.some((item) => item.id === product.id) ? 'checked' : ''}`}></div>
            <div className="product-icon">{product.metadata.icon}</div>
            <div className="product-info">
              <div className="product-name">
                {product.name}
                {
                  // product.badge && <span className={`${product.badge.toLowerCase()}-badge`}>{product.badge}</span>
                  <span className={`undefined-badge`}>{'undefined-badge'}</span>
                }
              </div>
              <div className="product-desc">{product.description}</div>
            </div>
            <div className="product-price">${(product.default_price.unit_amount / 100).toFixed(2)}</div>
          </div>
        ))}
      </div>

      {/* 2. UPSELL SECTION */}
      <div className="checkout-section upsell-section">
        <div className="checkout-section-title">
          <span>Add a Frame</span>
          <span className="save-tag">Complete the Look</span>
        </div>

        {UPSELLS.map((upsell) => (
          <div
            key={upsell.id}
            className={`upsell-card ${cartProductsItems.some((item) => item.id === upsell.id) ? 'selected' : ''}`}
            onClick={() => {
              if (cartProductsItems.some((item) => item.id === upsell.id)) {
                dispatch(shopActions.removeProductFromCard(upsell.id));
              } else {
                dispatch(shopActions.addProductToCard(upsell));
              }
            }}
          >
            <div className={`upsell-checkbox ${cartProductsItems.some((item) => item.id === upsell.id) ? 'checked' : ''}`}></div>
            <div className="upsell-icon">{upsell.metadata.icon}</div>
            <div className="upsell-info">
              <div className="upsell-name">{upsell.name}</div>
              <div className="upsell-desc">{upsell.description}</div>
            </div>
            <div className="upsell-price">
              <div className="upsell-original">${(Number(upsell.metadata.original_price)).toFixed(2)}</div>
              <div className="upsell-sale">${(upsell.default_price.unit_amount / 100).toFixed(2)}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. ACCESSORIES SECTION */}
      <div className="checkout-section upsell-section">
        <div className="checkout-section-title">
          <span>Unique Gift Add-ons</span>
          <span className="save-tag">Ships Separately</span>
        </div>

        <div className="accessories-grid">
          {ACCESSORIES.map((product) => (
            <div
              key={product.id}
              className={`accessory-card ${cartProductsItems.some((item) => item.id === product.id) ? 'selected' : ''}`}
              onClick={() => {
                if (cartProductsItems.some((item) => item.id === product.id)) {
                  dispatch(shopActions.removeProductFromCard(product.id));
                } else {
                  dispatch(shopActions.addProductToCard(product));
                }
              }}
            >
              <div className={`accessory-checkbox ${cartProductsItems.some((item) => item.id === product.id) ? 'checked' : ''}`}></div>
              <div className="accessory-icon">{product.metadata.icon}</div>
              <div className="accessory-name">{product.name}</div>
              <div className="accessory-price">${product.default_price.unit_amount / 100}</div>
            </div>
          ))}
        </div>

        <div className="shipping-note">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          Accessories ship separately (+${standard_shipping_for_gifts[0].default_price.unit_amount / 100} shipping each)
        </div>
      </div>
    </main>
  );
}