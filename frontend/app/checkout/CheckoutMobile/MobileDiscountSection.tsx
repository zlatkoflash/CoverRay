export default function MobileDiscountSection() {
  return (
    <div className="checkout-section discount-section">
      <div className="discount-banner">
        <div className="discount-icon">🎁</div>
        <div className="discount-text">
          <strong>Buying for multiple people?</strong>
          <span>Additional prints are 50% off!</span>
        </div>
        <button className="add-qty-btn" onClick={() => { }}>+ Add</button>
      </div>
    </div>
  );
}