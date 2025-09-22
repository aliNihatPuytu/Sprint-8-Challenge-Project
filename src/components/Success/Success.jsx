import React from "react";
import "./Success.css";

const Success = ({ navigateTo, orderData }) => {
  if (!orderData) {
    return (
      <div className="success-page">
        <div className="container">
          <div className="error-content">
            <h2 className="error-title">Sipariş Bilgisi Bulunamadı</h2>
            <button
              className="back-home-btn"
              onClick={() => navigateTo("home")}
            >
              Ana Sayfaya Dön
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="success-page">
      <div className="container">
        <div className="success-content">
          <div className="success-header">
            <img src="/images/iteration-1-images/logo.svg" alt="Teknolojik Yemekler" className="success-logo" />
            <p className="success-subtitle">lezzetin yolda</p>
            <h1 className="success-title">
              SİPARİŞ ALINDI
            </h1>
            <div className="success-divider"></div>
          </div>
          
          <div className="order-details">
            <h2 className="order-item-name">{orderData.productName}</h2>
            
            <div className="order-specs">
              <div className="spec-item">
                <span className="spec-label">Boyut:</span>
                <span className="spec-value">{orderData.size}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Hamur:</span>
                <span className="spec-value">{orderData.crust}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Ek Malzemeler:</span>
                <span className="spec-value">{orderData.toppings.join(', ')}</span>
              </div>
              {orderData.note && (
                <div className="spec-item">
                  <span className="spec-label">Not:</span>
                  <span className="spec-value">{orderData.note}</span>
                </div>
              )}
            </div>
          </div>

          <div className="final-summary">
            <h3>Sipariş Toplamı</h3>
            <div className="summary-line">
              <span>Seçimler</span>
              <span>{((orderData.totalPrice - (orderData.quantity * orderData.productPrice)) || 0).toFixed(2)}₺</span>
            </div>
            <div className="summary-line final-total">
              <span>Toplam</span>
              <span>{orderData.totalPrice.toFixed(2)}₺</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;