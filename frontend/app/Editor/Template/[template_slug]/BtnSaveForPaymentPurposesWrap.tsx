"use client";

import dynamic from "next/dynamic";

// We use dynamic import HERE to force SSR to skip this specific component
// I do this because of konva because konva is not compatible with ssr
const DynamicBtn = dynamic(
  () => import("./BtnSaveForPaymentPurposes"),
  { ssr: false }
);

export default function BtnSaveForPaymentPurposesWrap() {
  return (
    <DynamicBtn />
  );
}