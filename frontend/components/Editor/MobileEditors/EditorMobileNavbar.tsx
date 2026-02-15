import { EditorActions } from "@/lib/features/editor/editorSlice";
import { RootState } from "@/lib/store";
import { useDispatch, useSelector } from "react-redux";

export default function EditorMobileNavbar() {

  const dispatch = useDispatch();

  const stateEditor = useSelector((state: RootState) => state.editor);
  const canUndo = stateEditor.history.past.length > 0;
  const canRedo = stateEditor.history.future.length > 0;
  const undoArray = stateEditor.history.past;


  return (
    <>
      <div className="editor-nav-bar">
        <button
          style={{
            opacity: canUndo ? 1 : 0.3,
            pointerEvents: canUndo ? 'auto' : 'none'
          }}
          className="nav-item" id="undoBtn" onClick={() => {

            dispatch(EditorActions.undo())

          }}>
          <div className="nav-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 7v6h6"></path>
              <path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13"></path>
            </svg>
          </div>
          <div className="nav-label">Undo</div>
        </button>
        <button
          style={{
            opacity: canRedo ? 1 : 0.3,
            pointerEvents: canRedo ? 'auto' : 'none'
          }}
          className="nav-item" id="redoBtn" onClick={() => {

            dispatch(EditorActions.redo())

          }}>
          <div className="nav-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 7v6h-6"></path>
              <path d="M3 17a9 9 0 019-9 9 9 0 016 2.3l3 2.7"></path>
            </svg>
          </div>
          <div className="nav-label">Redo</div>
        </button>
        {
          /*<button className="nav-item" onClick={() => {
          dispatch(EditorActions.setMobileTextEditorPanelVisible(true))
        }}>
          <div className="nav-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="4 7 4 4 20 4 20 7"></polyline>
              <line x1="9" y1="20" x2="15" y2="20"></line>
              <line x1="12" y1="4" x2="12" y2="20"></line>
            </svg>
          </div>
          <div className="nav-label">Text</div>
        </button>*/
        }
        <button className="nav-item" onClick={() => {
          dispatch(EditorActions.setMobileTextColorPickerVisible(true))
        }}>
          <div className="nav-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <circle cx="12" cy="12" r="4" fill="currentColor"></circle>
            </svg>
          </div>
          <div className="nav-label">Color</div>
        </button>
        <button className="nav-item" onClick={() => {
          dispatch(EditorActions.setMobileTextFontSizePickerVisible(true))
        }}>
          <div className="nav-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12H3M21 12l-4-4m4 4l-4 4M3 12l4-4m-4 4l4 4"></path>
            </svg>
          </div>
          <div className="nav-label">Size</div>
        </button>
      </div>
    </>
  );
}