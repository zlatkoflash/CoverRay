export default function ZButton({
  children,
  onClick,
  disabled,
  loading,
  buttonVariant
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  buttonVariant: "checkout-btn" | "modal-btn primary" | "modal-btn secondary";
}) {
  return (
    <div className={`z-button ${loading ? "loading" : "idle"}`}>
      <button
        className={`${buttonVariant}`}
        onClick={onClick}
        // Force disabled if loading is true to prevent double-clicks
        disabled={disabled || loading}
      >
        {loading ? (
          <div className="button-content">
            <span className="spinner"></span>
            <span>Processing...</span>
          </div>
        ) : (
          children
        )}
      </button>
    </div>
  );
}