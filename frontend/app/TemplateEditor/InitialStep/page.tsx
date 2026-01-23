import ScreenHeader from "@/components/headers/ScreenHeader.delete";
import Link from "next/link";

export default function TemplateEditorInitialStep() {
  return (
    <>
      <div className="screen">
        {
          /*
          <div className="app-header">
          <div className="logo">YourCover</div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <button className="header-btn">Save Draft</button>
            <button className="btn-primary" style={{ padding: "10px 20px" }}>Preview →</button>
          </div>
        </div>
          */
        }
        <ScreenHeader>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <button className="header-btn">Save Draft</button>
            <button className="btn-primary" style={{ padding: "10px 20px" }}>Preview →</button>
          </div>
        </ScreenHeader>
        <div className="editor-layout">
          <div className="editor-sidebar">
            <div className="progress-bar"><div className="progress-fill" style={{ width: "66%" }}></div></div>
            <div className="progress-text">2 of 3 steps complete</div>
            <div className="step-item">
              <div className="step-icon complete">✓</div>
              <div className="step-content">
                <div className="step-title">Template</div>
                <div className="step-status complete">DOGUE</div>
              </div>
            </div>
            <Link href="/SelectTemplate" className="step-item">
              <div className="step-icon complete">✓</div>
              <div className="step-content">
                <div className="step-title">Photo</div>
                <div className="step-status complete">Uploaded</div>
              </div>
            </Link>
            <div className="step-item active">
              <div className="step-icon active">✎</div>
              <div className="step-content">
                <div className="step-title">Text</div>
                <div className="step-status">In progress</div>
              </div>
            </div>
          </div>
          <div className="editor-canvas">
            <div className="canvas-preview">[Live Preview]</div>
          </div>
          <div className="editor-panel">
            <div className="panel-title">For Sarah's Anniversary</div>
            <div className="panel-subtitle">Changes update live on the cover</div>

            <div className="form-group">
              <label className="form-label">Their name</label>
              <input className="form-input large" value="SARAH" />
            </div>

            <div className="form-group">
              <label className="form-label">The date</label>
              <input className="form-input" value="February 14, 2025" />
            </div>

            <div className="switch-link">
              Need more control? <strong>Switch to Studio Mode →</strong>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}