"use client";

export default function EditorSidebarPanel(
  { initialTemplate }: {
    initialTemplate: any;
  }
) {
  return (
    <div className="editor-panel">
      <div className="panel-title">For Sarah's Anniversary</div>
      <div className="panel-subtitle">Changes update live on the cover</div>

      {
        initialTemplate.pages[0].children.map((item: any) => {
          return (
            <div key={item.id}>
              <div className="form-group">
                <label className="form-label">{item.name !== "" ? item.name : item.id}</label>
                <input className="form-input large" value={item.text} onChange={(e) => console.log(e.target.value)} id={`input-${item.id}`} />
              </div>
            </div>
          );
        })
      }

      <div className="form-group">
        <label className="form-label">Their name</label>
        <input className="form-input large" value="SARAH" onChange={(e) => console.log(e.target.value)} />
      </div>

      <div className="form-group">
        <label className="form-label">The date</label>
        <input className="form-input" value="February 14, 2025" onChange={(e) => console.log(e.target.value)} />
      </div>

      <div className="switch-link">
        Need more control? <strong>Switch to Studio Mode →</strong>
      </div>
    </div>
  );
}