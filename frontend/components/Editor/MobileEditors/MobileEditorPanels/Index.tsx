import MobileEditTextPanel from "./MobileEditTextPanel";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { EditorActions } from "@/lib/features/editor/editorSlice";
import MobileEditTextColorPanel from "./MobileEditTextColorPanel";
import MobileEditTextSizePanel from "./MobileEditTextSizePanel";

export default function MobileEditorPanels() {

  const dispatch = useDispatch();
  const stateEditor = useSelector((state: RootState) => state.editor);


  // return null;
  return <>
    <div className={`panel-backdrop ${stateEditor.mobileTextEditorPanelVisible
      || stateEditor.mobileTextColorPickerVisible
      || stateEditor.mobileTextFontSizePickerVisible
      ? "visible" : ""}`} onClick={() => {
        dispatch(EditorActions.setMobileTextEditorPanelVisible(false));
        dispatch(EditorActions.setMobileTextColorPickerVisible(false));
        dispatch(EditorActions.setMobileTextFontSizePickerVisible(false));
      }}></div>
    <MobileEditTextPanel />
    <MobileEditTextColorPanel />
    <MobileEditTextSizePanel />
  </>
}