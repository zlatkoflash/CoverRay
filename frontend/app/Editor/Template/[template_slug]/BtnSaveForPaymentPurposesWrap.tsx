"use client";

import dynamic from "next/dynamic";

// We use dynamic import HERE to force SSR to skip this specific component
const DynamicBtn = dynamic(
  () => import("./BtnSaveForPaymentPurposes"),
  { ssr: false }
);

export default function BtnSaveForPaymentPurposesWrap() {
  return (
    <DynamicBtn />
  );
}