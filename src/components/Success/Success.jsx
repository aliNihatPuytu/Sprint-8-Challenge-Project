import React from "react";
import "./Success.css";

const Success = ({ navigateTo, orderData }) => {
  if (!orderData) {
    return (
      <div className="success-page">
        <div className="container">
          <div className="error-content">
            <h2 className="error-title">Sipariş Bilgisi Bulunamadı</h2>
            <button className="back-home-btn" onClick={() => navigateTo("home")}>
              Ana Sayfaya Dön
            </button>
          </div>
        </div>
      </div>
    );
  }

  const toppingsPrice =
    orderData.totalPrice - orderData.quantity * orderData.productPrice;

  return (
    <div className="success-page">
      <div className="container">
        <img
          src="/images/iteration-1-images/logo.svg"
          alt="Teknolojik Yemekler"
          className="main-brand-header"
        />

        <div className="success-content">
          <header
            className="order-confirmation-header"
            role="status"
            aria-live="polite"
          >
            <p className="success-subtitle">lezzetin yolda</p>
            <h2 className="success-title">SİPARİŞ ALINDI</h2>
            <div className="success-divider" role="separator" />
          </header>

          <main className="order-details">
            <h3 className="order-item-name">{orderData.productName}</h3>

            <div className="order-specs" aria-label="Sipariş Özeti">
              <p>
                <span className="spec-label">Boyut:</span>
                <span className="spec-value">{orderData.size}</span>
              </p>
              <p>
                <span className="spec-label">Hamur:</span>
                <span className="spec-value">{orderData.crust}</span>
              </p>
              <p>
                <span className="spec-label">Ek Malzemeler:</span>
                <span className="spec-value">
                  {orderData.toppings?.length
                    ? orderData.toppings.join(", ")
                    : "Yok"}
                </span>
              </p>
            </div>
          </main>

          <section
            className="final-summary"
            aria-labelledby="summary-title"
            role="region"
          >
            <h3 className="summary-title" id="summary-title">
              Sipariş Toplamı
            </h3>
            <div className="summary-line">
              <span>Seçimler</span>
              <span>{toppingsPrice.toFixed(2)}₺</span>
            </div>
            <div className="summary-line">
              <span>Toplam</span>
              <span>{orderData.totalPrice.toFixed(2)}₺</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Success;
