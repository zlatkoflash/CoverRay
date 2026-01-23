export default function ScreenHeader({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="app-header">
        <div className="logo">YourCover</div>

        <div>
          {children}
        </div>
      </div>
    </>
  );
}