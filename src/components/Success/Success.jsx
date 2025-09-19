import React from "react";
import "./Success.css"

const Success = ({ navigateTo, orderData }) => {
    if (!orderData) {
        return (
            <section className="success">
                <div className="container">
                    <div className="success-content">
                        <h2>Sipariş Bilgisi Bulunamadı</h2>
                        <button
                        className="back-btn"
                        onClick={() => navigateTo("home")}
                        >
                            Ana Sayfaya Dön
                        </button>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="success">
            <div className="container">
                <div className="success-content">
                    <h2>TEBRİKLER!<br />SİPARİŞİNİZ ALINDI!</h2>

                    <div className="order-details">
                        <h3>{orderData.size} Boy Position Absolute Acı Pizza</h3>

                        <div className="detail-row">
                            <strong>Hamur:</strong> {orderData.crust}
                        </div>

                        <div className="detail-row">
                            <strong>Ek Malzemeler:</strong> {orderData.toppings.join(", ")}
                        </div>
                        
                        {orderData.note && (
                            <div className="detail-row">
                                <strong>Not:</strong> {orderData.note}
                                </div>
                        )}

                        <div className="order-summary">
                            <div className="summary-line">
                                <span>Sipariş Toplamı</span>
                            </div>
                            <div className="summary-line">
                                <span>Seçimler</span>
                                <span>{(parseFloat(orderData.totalPrice) - 85.50).toFixed(2)} ₺</span>
                            </div>
                            <div className="summary-line total">
                                <span>Toplam</span>
                                <span>{orderData.totalPrice} ₺</span>
                            </div>
                        </div>
                    </div>

                    <div className="success-actions">
                        <button 
                        className="back-btn"
                        onClick={() => navigateTo("home")}
                        > 
                        Ana Sayfaya Dön 
                        </button>
                        <button 
                        className="new-order-btn"
                        onClick={() => navigateTo("order")}
                        >
                            Yeni Sipariş Ver
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Success