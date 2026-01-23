import PhotoDragDrop from "@/components/dragDrop/PhotoDragDrop";
import TemplatesGridSection from "@/components/grids/TemplatesGridSection";
import ScreenHeader from "@/components/headers/ScreenHeader.delete";
import SectionSelectPhoto from "@/components/sections/SectionSelectPhoto";
import Link from "next/link";

export default function SelectTemplate() {
  return (
    <>
      <div className="screen">
        <ScreenHeader>
          {
            // <button className="header-btn">← Back</button>
          }
          <Link href={"/"} className="header-btn">← Back</Link>
        </ScreenHeader>
        <SectionSelectPhoto />
      </div>
    </>
  );
}