"use client";

import { RootState } from "@/lib/store";
import { INDEX_DB_TEMPLATE_REF_FOR_PAYMENT, LS_GetTemplateFromIndexDB } from "@/utils/editor-local-storage";
import { ITemplate } from "@/utils/interfaceDatabase";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function MobilePreviewMagazzine() {

  const [thumbnail, setThumbnail] = useState<string>("");
  const [templateDB, setTemplateDB] = useState<ITemplate | null>(null);
  const templateState = useSelector((state: RootState) => state.template);
  const selectedTemplate = templateState.selectedTemplate;
  const shopState = useSelector((state: RootState) => state.shop);
  const selectedProductsSource = shopState.cardProductsItems;
  const selectedProducts = [...selectedProductsSource].sort((a, b) => a.default_price.unit_amount - b.default_price.unit_amount);
  const IHaveGifts = selectedProducts.filter(item => item.metadata.group === "unique-gift").length > 0;
  // const standard_shipping_for_gifts = shopState.products.standard_shipping_for_gifts;
  // const ALL_ITEMS = cartProductsItems;
  // console.log("ALL_ITEMS:", ALL_ITEMS);

  console.log("selectedTemplate:", selectedTemplate);

  useEffect(() => {
    const loadPreview = async () => {
      const data = await LS_GetTemplateFromIndexDB(INDEX_DB_TEMPLATE_REF_FOR_PAYMENT);
      setTemplateDB(data?.templateDB || null);
      if (data?.thumbnailDataUrl) {
        setThumbnail(data.thumbnailDataUrl);
      }

      console.log("data:", data);
    };
    loadPreview();
  }, []);


  return <>
    <div className="checkout-preview-section">
      <div className="checkout-preview" id="checkoutPreview" style={{
        backgroundImage: `url(${thumbnail})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}></div>
      <div className="quality-badge">✓ Print-Ready Quality</div>
      <div style={{ marginTop: "8px", fontSize: "13px", color: "#666" }}>
        Your custom <strong>{templateDB?.name}</strong> cover
      </div>
    </div>
  </>;
}
