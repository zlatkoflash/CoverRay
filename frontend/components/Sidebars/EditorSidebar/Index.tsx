"use client"

import { updateEditorImage } from "@/lib/features/editor/editorSlice";
import { AppDispatch, RootState } from "@/lib/store";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import EditorTextInput from "./EditorTextInput";
import EditorTextStyle from "./EditorTextStyle";
import EditorColor from "./EditorColor";
import EditorTextSize from "./EditorTextSize";
import EditorFontsSelector from "./EditorFontsSelector";



// Define the interface for the props
interface PreviewAndChangePhotoProps {
  onFileSelect: (file: File) => void;
  // currentImage?: string | null; // Optional: To show the preview in the thumb
}

const PreviewAndChangePhoto = ({ onFileSelect }: PreviewAndChangePhotoProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const coverURL = useSelector((state: RootState) => state.editor.imageUrl);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Pass the file back to the parent component
      onFileSelect(file);

      // Reset input value so the same file can be selected again if deleted
      event.target.value = '';
    }
  };

  return (
    <div className="photo-preview">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />

      <div className="photo-thumb" id="photoThumb" style={{ overflow: 'hidden' }}>
        {coverURL ? (
          <img
            src={coverURL as string}
            alt="Thumb"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div className="placeholder-icon" />
        )}
      </div>

      <div className="photo-info">
        <div className="photo-name">Cover Photo</div>
        <div className="photo-status">
          {coverURL ? "✓ Print-ready quality" : "No photo selected"}
        </div>
      </div>

      <button className="photo-change" onClick={handleButtonClick}>
        Change
      </button>
    </div>
  );
};

export default function EditorSidebar() {

  const dispatch = useDispatch<AppDispatch>();

  const selectedKonvaItem = useSelector((state: RootState) => state.editor.selectedKonvaItem);

  return (
    <>
      <aside className="editor-panel">

        <PreviewAndChangePhoto onFileSelect={async (file: File) => {
          console.log("File ready for saving:", file.name);
          // await LS_SaveImageIntoIndexDB(file);
          // const imageUrl = await LS_GetImageURL();
          // LS_SaveData()
          // console.log("Image URL:", imageUrl);
          dispatch(updateEditorImage(file));
        }} />

        <div className="panel-section">
          <h2 className="panel-title">Edit Your Cover</h2>
          <p className="panel-subtitle">Changes appear instantly on preview</p>
        </div>

        {
          selectedKonvaItem !== null && selectedKonvaItem.type === "text" &&
          <EditorTextInput />
        }

        {
          selectedKonvaItem !== null && selectedKonvaItem.type === "text" &&
          <EditorFontsSelector />
        }

        {
          selectedKonvaItem !== null && selectedKonvaItem.type === "text" &&
          <EditorTextStyle />
        }

        {
          selectedKonvaItem !== null && selectedKonvaItem.type === "text" &&
          <EditorColor />
        }

        {
          selectedKonvaItem !== null && selectedKonvaItem.type === "text" &&
          <EditorTextSize />
        }


      </aside>
    </>
  );
}