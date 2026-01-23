'use client';

import { useEffect, useState } from "react";
import PhotoDragDrop from "../dragDrop/PhotoDragDrop";
import TemplatesGridSection from "../grids/TemplatesGridSection";
import { LS_GetData, LS_KEY_IMAGE_URL } from "@/utils/editor-local-storage";

export default function SectionSelectPhoto() {

  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const savedImageUrl = LS_GetData(LS_KEY_IMAGE_URL);
    console.log("savedImageUrl:", savedImageUrl);
    if (savedImageUrl) {
      setImageUrl(savedImageUrl);
    }
  }, [])

  return (
    <div className="magic-mirror-layout">

      <PhotoDragDrop onImageUploaded={(imageUrl) => {
        console.log(imageUrl)
        setImageUrl(imageUrl);
      }} />

      <TemplatesGridSection imageUrl={imageUrl} />


    </div>
  )
}