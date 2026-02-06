import './../../../../assets/fonts/_EditorFonts.scss';

export default function EditorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="editor-container">
      {children}
    </div>
  );
}