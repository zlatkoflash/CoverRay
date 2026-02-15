"use client";

import { updateEditorImage } from "@/lib/features/editor/editorSlice";
import { AppDispatch, RootState } from "@/lib/store";
import { LS_GetImageURL, LS_SaveData, LS_SaveImageIntoIndexDB } from "@/utils/editor-local-storage";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import EditorCanvasUndoRedo from "./EditorCanvasUndoRedo";
import EditorObjectStacking from "../Sidebars/EditorSidebar/ToolsAdministrator/EditorObjectStacking";
import EditorSizeOfTheComponent from "../Sidebars/EditorSidebar/ToolsAdministrator/EditorSizeOfTheComponent";
import EditorLockDraggable from "../Sidebars/EditorSidebar/ToolsAdministrator/EditorLockDraggable";
import AddRemoveItem from "../Sidebars/EditorSidebar/ToolsAdministrator/AddRemoveItem";
import Link from "next/link";

const ToolbarChangeThePhoto = ({ onFileSelect }: { onFileSelect: (file: File) => void }) => {
  // 1. Create a reference to the hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    // 2. When the custom button is clicked, trigger the hidden input
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // 3. Optional: Validate that it is actually an image
      if (!file.type.startsWith('image/')) {
        alert("Please select an image file.");
        return;
      }

      console.log("File ready for saving:", file.name);

      // 4. Pass the file to the parent component for saving to IndexedDB
      if (onFileSelect) {
        onFileSelect(file);
      }
    }
  };

  return (
    <>
      {/* The hidden input restricted to images */}
      {
        /*<input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />

      <button className="toolbar-btn" onClick={handleButtonClick}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <circle cx="8.5" cy="8.5" r="1.5"></circle>
          <polyline points="21 15 16 10 5 21"></polyline>
        </svg>
        Change Photo
      </button>*/
      }
      <Link href={"/"} className="toolbar-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        Change Template
      </Link>
    </>
  );
};


const ToolbarChangeElementsPlaceholder = ({ onFileSelect }: { onFileSelect: (file: File) => void }) => {
  // 1. Create a reference to the hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    // 2. When the custom button is clicked, trigger the hidden input
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // 3. Optional: Validate that it is actually an image
      if (!file.type.startsWith('image/')) {
        alert("Please select an image file.");
        return;
      }

      console.log("File ready for saving:", file.name);

      // 4. Pass the file to the parent component for saving to IndexedDB
      if (onFileSelect) {
        onFileSelect(file);
      }
    }
  };

  return (
    <>
      {/* The hidden input restricted to images */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />

      <button className="toolbar-btn" onClick={handleButtonClick}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <circle cx="8.5" cy="8.5" r="1.5"></circle>
          <polyline points="21 15 16 10 5 21"></polyline>
        </svg>
        Elements Placeholder
      </button>
    </>
  );
};


export default function EditorCanvasToolbar() {

  const dispatch = useDispatch<AppDispatch>();
  const authState = useSelector((state: RootState) => state.auth);
  const user = authState.user;
  const selectedKonvaItem = useSelector((state: RootState) => state.editor.selectedKonvaItem);


  return (
    <div className="canvas-toolbars-wrapper">
      <div className="canvas-toolbar">
        <ToolbarChangeThePhoto onFileSelect={async (file: File) => {
          console.log("File ready for saving:", file.name);
          // await LS_SaveImageIntoIndexDB(file);
          // const imageUrl = await LS_GetImageURL();
          // LS_SaveData()
          // console.log("Image URL:", imageUrl);
          dispatch(updateEditorImage(file));
        }} />
        <EditorCanvasUndoRedo />
      </div>
      {
        /*
        For now no need for this will use the database link for this purposes
        <div className="canvas-toolbar">
        <ToolbarChangeElementsPlaceholder onFileSelect={async (file: File) => {
          dispatch(updateEditorImage(file));
        }} />
      </div>*/
      }

      {
        /*user !== null && user.user_metadata.role === "administrator" &&
        <div>
          <AddRemoveItem />
          {selectedKonvaItem !== null &&
            <>
              <EditorLockDraggable />
              {
                // <EditorAllowEdit />
              }

              <EditorSizeOfTheComponent />
              <EditorObjectStacking />
            </>
          }
        </div>*/
      }

    </div>
  );
}