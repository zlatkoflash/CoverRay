import { LS_KEY_TEMPLATE_ID, LS_SaveData } from "@/utils/editor-local-storage";
import Link from "next/link";

export default function TemplatesGridSection({
  imageUrl
}: {
  imageUrl: string | null
}) {
  // 1. Define your templates array
  const templates = [
    { id: 1, name: "DOGUE", preview: "DOGUE", isPopular: true },
    { id: 2, name: "FASHION", preview: "FASHION", isPopular: false },
    { id: 3, name: "VOGUE", preview: "VOGUE", isPopular: false },
    { id: 4, name: "TIME", preview: "TIME", isPopular: false },
  ];

  const hasImage = imageUrl !== null && imageUrl !== "";

  return (
    <div className="template-grid-section" style={{ position: "relative" }}>

      {/* Overlay for when no image is uploaded */}
      {!hasImage && (
        <>
          <div style={{
            position: "absolute", top: "0", left: "0", right: "0", bottom: "0",
            background: "rgba(124, 58, 237, 0.95)", display: "flex",
            flexDirection: "column", alignItems: "center", justifyContent: "center",
            color: "white", zIndex: "5", borderRadius: "0"
          }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>✨</div>
            <div style={{ fontSize: "20px", fontWeight: "600", marginBottom: "8px" }}>Add your photo first</div>
            <div style={{ fontSize: "14px", opacity: "0.8" }}>Templates will appear with your face</div>
          </div>
          <div className="template-grid-header">
            <span style={{ fontWeight: "600" }}>{templates.length} templates</span>
            <span style={{ fontSize: "13px", color: "#666" }}>Partner • Anniversary</span>
          </div>
        </>
      )}

      {/* Grid rendering from the array */}
      {hasImage && (
        <div className="template-grid">
          {templates.map((template) => (
            <Link
              href={`/EditTemplate/Basic`}
              key={template.id} className="template-card"
              onClick={() => {
                LS_SaveData(LS_KEY_TEMPLATE_ID, template.id.toString());
              }}
            >
              <div className="template-preview">
                {/* If imageUrl exists, you might want to show it here 
                   as a background or inside the preview 
                */}
                {template.preview}
              </div>
              <div className="template-name">
                {template.name}
                {template.isPopular && <span className="badge">Popular</span>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}