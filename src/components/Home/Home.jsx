import React from "react";
import "./Home.css";

const Home = ({ navigateTo }) => {
  const products = [
    {
      id: 1,
      name: "Terminal Pizza",
      price: 60,
      rating: 4.9,
      ratingCount: 200,
      image: "/images/iteration-2-images/pictures/food-1.png"
    },
    {
      id: 2,
      name: "Position Absolute Acı Pizza",
      price: 85.50,
      rating: 4.9,
      ratingCount: 200,
      image: "/images/iteration-2-images/pictures/food-2.png"
    },
    {
      id: 3,
      name: "useEffect Tavuklu Burger",
      price: 75,
      rating: 4.9,
      ratingCount: 200,
      image: "/images/iteration-2-images/pictures/food-3.png"
    }
  ];

  const specialProducts = [
    {
      id: 4,
      name: "Position Absolute Acı Burger",
      type: "Özel Lezzetus"
    },
    {
      id: 5,
      name: "Hackathlon Burger Menü",
      type: "Burger Menü"
    },
    {
      id: 6,
      name: "Çooook hızlı npm gibi kurye",
      type: "Hızlı Kurye"
    }
  ];

  return (
    <div className="home">
      <section className="hero-section">
        <div className="hero-content">
          <img className="logo-img" src="/images/iteration-1-images/logo.svg" alt="Teknolojik Yemekler" />
          <div className="hero-subtitle">fırsatı kaçırma</div>
          <h1 className="hero-title">
            <span>KOD</span> <span>ACIKTIRIR</span> <br />
            <span>PIZZA,</span> <span>DOYURUR</span>
          </h1>
          <button className="cta-button" type="button" onClick={() => navigateTo("order")}>
            ACIKTIM
          </button>
        </div>
        <div className="hero-decorations" aria-hidden="true"></div>
      </section>

      <nav className="nav-menu" aria-label="Kategoriler">
        <a href="#" className="nav-item">
          <img src="/images/iteration-2-images/icons/1.svg" alt="" aria-hidden="true" />
          <span>YENİ! Kore</span>
        </a>
        <a href="#" className="nav-item">
          <img src="/images/iteration-2-images/icons/2.svg" alt="" aria-hidden="true" />
          <span>Pizza</span>
        </a>
        <a href="#" className="nav-item">
          <img src="/images/iteration-2-images/icons/3.svg" alt="" aria-hidden="true" />
          <span>Burger</span>
        </a>
        <a href="#" className="nav-item">
          <img src="/images/iteration-2-images/icons/4.svg" alt="" aria-hidden="true" />
          <span>Kızartmalar</span>
        </a>
        <a href="#" className="nav-item">
          <img src="/images/iteration-2-images/icons/5.svg" alt="" aria-hidden="true" />
          <span>Fast food</span>
        </a>
        <a href="#" className="nav-item">
          <img src="/images/iteration-2-images/icons/6.svg" alt="" aria-hidden="true" />
          <span>Gazlı içecek</span>
        </a>
      </nav>

      <main className="content-section">
        <div className="cards-container">
          <div className="card card-red card-square bg-kart1" onClick={() => navigateTo("order", specialProducts[0])}>
            <div className="card-content">
              <h2 className="card-title">Özel<br />Lezzetus</h2>
              <p className="card-subtitle">Position Absolute Acı Burger</p>
              <button className="card-button" type="button">SİPARİŞ VER</button>
            </div>
          </div>
          <div className="card-column">
            <div className="card card-dark card-rect bg-kart2" onClick={() => navigateTo("order", specialProducts[1])}>
              <div className="card-content">
                <h2 className="card-title-small">Hackathlon<br />Burger Menü</h2>
                <button className="card-button" type="button">SİPARİŞ VER</button>
              </div>
            </div>
            <div className="card card-light card-rect bg-kart3" onClick={() => navigateTo("order", specialProducts[2])}>
              <div className="card-content">
                <h2 className="card-title-small">
                  <span className="card-accent">Çoooooook</span> hızlı<br />npm gibi kurye
                </h2>
                <button className="card-button" type="button">SİPARİŞ VER</button>
              </div>
            </div>
          </div>
        </div>

        <header className="products-header">
          <p className="products-subtitle">en çok paketlenen menüler</p>
          <h2 className="products-title">Acıktıran Kodlara Doyuran Lezzetler</h2>
        </header>

        <div className="category-tabs" role="tablist" aria-label="Kategori Sekmeleri">
          <a href="#" className="tab" role="tab" aria-selected="false">
            <img src="/images/iteration-2-images/icons/1.svg" alt="" aria-hidden="true" />
            <span>Ramen</span>
          </a>
          <a href="#" className="tab active" role="tab" aria-selected="true">
            <img src="/images/iteration-2-images/icons/2.svg" alt="" aria-hidden="true" />
            <span>Pizza</span>
          </a>
          <a href="#" className="tab" role="tab" aria-selected="false">
            <img src="/images/iteration-2-images/icons/3.svg" alt="" aria-hidden="true" />
            <span>Burger</span>
          </a>
          <a href="#" className="tab" role="tab" aria-selected="false">
            <img src="/images/iteration-2-images/icons/4.svg" alt="" aria-hidden="true" />
            <span>French fries</span>
          </a>
          <a href="#" className="tab" role="tab" aria-selected="false">
            <img src="/images/iteration-2-images/icons/5.svg" alt="" aria-hidden="true" />
            <span>Fast food</span>
          </a>
          <a href="#" className="tab" role="tab" aria-selected="false">
            <img src="/images/iteration-2-images/icons/6.svg" alt="" aria-hidden="true" />
            <span>Soft drinks</span>
          </a>
        </div>

        <div className="products-grid">
          {products.map(product => (
            <article key={product.id} className="product-card" onClick={() => navigateTo("order", product)}>
              <img loading="lazy" decoding="async" src={product.image} alt={product.name} className="product-image" />
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <div className="product-rating">
                  <span className="rating-score">{product.rating}</span>
                  <span className="rating-count">({product.ratingCount})</span>
                  <span className="product-price">{product.price}₺</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;