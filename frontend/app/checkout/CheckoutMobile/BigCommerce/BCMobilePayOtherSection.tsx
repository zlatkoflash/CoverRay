export default function BCMobilePayOtherSection() {
  return <>
    <div className="checkout-section pay-section" style={{
      paddingBottom: "150px"
    }}>
      <div className="quick-pay-options">
        <button className="quick-pay-btn apple-pay" onClick={() => { }}>
          <span></span> Pay
        </button>
        <button className="quick-pay-btn google-pay" onClick={() => { }}>
          <span style={{ fontWeight: 700 }}>G</span> Pay
        </button>
      </div>
      <div className="divider-text">or pay with card</div>
    </div>
  </>;
}