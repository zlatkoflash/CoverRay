"use client";

import ZButton from '@/components/buttons/ZButton';
import { RootState } from '@/lib/store';
import { INDEX_DB_TEMPLATE_REF_FOR_PAYMENT, LS_GetTemplateFromIndexDB } from '@/utils/editor-local-storage';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import PaymentButtons from './PaymenthButtons';
import { SavingTotal, ShopTotal, ShopTotalShipping } from '@/lib/features/shop/shopSlice';
import PaymenthButtonsBC from './PaymenthButtonsBC';
import { IBCCartItem } from '@/utils/interfacesBigCommerce';
import BCCartItem from './BiCommerceComponents/BCCartItem';

/*const ALL_ITEMS = [
  { id: 'digital', name: 'Digital Download', price: 9.95, isUpsell: false },
  { id: 'print', name: 'Photo Print', price: 15.00, isUpsell: false },
  { id: 'poster', name: 'Poster Print', price: 35.00, isUpsell: false },
  { id: 'canvas', name: 'Canvas Print', price: 64.95, isUpsell: false },
  { id: 'frame', name: 'Matted Frame', price: 59.50, isUpsell: true },
  { id: 'mug', name: 'Mug', price: 19.95, isUpsell: true, shippingAdd: 6.50 },
  { id: 'mousepad', name: 'Mouse Pad', price: 16.95, isUpsell: true, shippingAdd: 6.50 },
  { id: 'tshirt', name: 'T-Shirt', price: 19.95, isUpsell: true, shippingAdd: 6.50 },
];*/

interface AsideCheckoutProps {
  selectedIds: string[];
}

export default function AsideCheckoutBC({ selectedIds = [] }: AsideCheckoutProps) {
  const [thumbnail, setThumbnail] = useState<string>("");
  const shopState = useSelector((state: RootState) => state.shop);
  const selectedProductsSource = shopState.cardProductsItems;
  const selectedProducts = [...selectedProductsSource].sort((a, b) => a.default_price.unit_amount - b.default_price.unit_amount);
  const IHaveGifts = selectedProducts.filter(item => item.metadata.group === "unique-gift").length > 0;
  const standard_shipping_for_gifts = shopState.products.standard_shipping_for_gifts;
  // const ALL_ITEMS = cartProductsItems;
  // console.log("ALL_ITEMS:", ALL_ITEMS);

  const bigCommerceState = useSelector((state: RootState) => state.bigCommerce);
  const bcCart = bigCommerceState.cart;
  console.log("bcCart:", bcCart);


  useEffect(() => {
    const loadPreview = async () => {
      const data = await LS_GetTemplateFromIndexDB(INDEX_DB_TEMPLATE_REF_FOR_PAYMENT);
      if (data?.thumbnailDataUrl) {
        setThumbnail(data.thumbnailDataUrl);
      }
    };
    loadPreview();
  }, []);

  // Filter selected items
  // const selectedProducts = ALL_ITEMS.filter(item => selectedIds.includes(item.id));

  // Calculations
  // const subtotal = selectedProducts.reduce((sum, item) => sum + item.default_price.unit_amount / 100, 0);

  // Logical Shipping: Only if physical products are selected (not just digital)
  // const hasPhysicalItems = selectedProducts.some(item => item.id !== 'digital');
  // const baseShipping = standard_shipping_for_gifts[0] !== undefined && IHaveGifts ? standard_shipping_for_gifts[0].default_price.unit_amount / 100 : 0;

  // Add-on shipping for accessories
  // const extraShipping = selectedProducts.reduce((sum, item) => sum
  // + (item.shippingAdd || 0)
  // , 0);
  // const totalShipping = baseShipping + extraShipping;

  // const total = subtotal + totalShipping;
  // const savings = 19.50; // You can make this dynamic if needed


  let totalItems: IBCCartItem[] = [];
  if (bcCart === null) {
    totalItems = [];
  } else {
    totalItems = [...bcCart.line_items.digital_items, ...bcCart.line_items.physical_items];
  }


  return (
    <aside className="checkout-sidebar">
      <div
        className="sidebar-preview"
        id="sidebarPreview"
        style={{ backgroundImage: thumbnail ? `url(${thumbnail})` : 'none' }}
      ></div>
      <div className="quality-badge">✓ Print-Ready Quality</div>

      <div className="price-summary">
        {
          // selectedProducts.map((item) => (
          totalItems.map((item: IBCCartItem, index: number) => (
            /*<div key={item.id} className={`price-row ${
              // item.isUpsell 
              item.id === ""
                ? 'upsell' : ''}`}>
              <span>
                {item.name}
                {
                  // item.shippingAdd ? ` (+$${item.shippingAdd.toFixed(2)})` : ''
                }
              </span>
              <span>${(item.default_price.unit_amount / 100).toFixed(2)}</span>
            </div>*/
            <BCCartItem item={item} key={index + '-' + item.id} />
          ))}

        {ShopTotalShipping(shopState) > 0 && (
          <div className="price-row" id="shippingRow">
            <span>Shipping</span>
            <span id="shippingPrice">${ShopTotalShipping(shopState).toFixed(2)}</span>
          </div>
        )}

        <div className="price-row total">
          <span>Total</span>
          <span id="totalPrice">${
            // ShopTotal(shopState).toFixed(2)
            bcCart !== null ? bcCart?.base_amount.toFixed(2) : "0.00"
          }</span>
        </div>
      </div>

      {selectedIds.includes('frame') && (
        <div className="savings-badge" id="savingsBadge">
          🎉 You're saving <span>${SavingTotal(shopState).toFixed(2)}</span>!
        </div>
      )}

      {/* <PaymentButtons /> */}
      <PaymenthButtonsBC />

      <div className="trust-indicators">
        <span>🔒 Secure</span>
        <span>✓ Money-back</span>
        <span>📦 Fast shipping</span>
      </div>
    </aside>
  );
}