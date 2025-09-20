import React from "react";

const Home = ({ navigateTo }) => {
  return (
    <section className="home">
      <div className="hero-banner">
        <div className="hero-content">
          <div className="logo-text">
            <span className="line1">KOD</span>
            <span className="line2">ACIKTIRIR</span>
            <span className="line3">PIZZA,</span>
            <span className="line4">DOYURUR</span>
          </div>
          <button
            className="order-btn"
            onClick={() => navigateTo("order")}
            aria-label="Sipariş vermek için tıklayın"
          >
            ACIKTIN
          </button>
        </div>
      </div>

      <div className="featured-section">
        <h2>Özel Lezzetler</h2>
        <div className="featured-items">
          <div className="featured-item">
            <h3>Position: Absolute Acı Burger</h3>
            <p>Bir lokmada kodunuzu düzeltin!</p>
          </div>
          <div className="featured-item">
            <h3>Hackathon Burger Menü</h3>
            <p>36 saat boyuncu sizi ayakta tutacak enerji</p>
          </div>
          <div className="featured-item">
            <h3>npm gibi Hızlı Kurye</h3>
            <p>Siparişiniz göz açıp kapayıncaya kadar kapınızda</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Home;