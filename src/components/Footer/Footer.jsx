import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <img src="/images/iteration-2-images/footer/logo-footer.svg" alt="Teknolojik Yemekler" className="footer-logo" />
          <div className="contact-info">
            <p><img src="/images/iteration-2-images/footer/icons/icon-1.png" alt="" className="contact-icon" />341 Londonderry Road,<br />İstanbul Türkiye</p>
            <p><img src="/images/iteration-2-images/footer/icons/icon-2.png" alt="" className="contact-icon" />aciktim@teknolojikyemekler.com</p>
            <p><img src="/images/iteration-2-images/footer/icons/icon-3.png" alt="" className="contact-icon" />+90 216 123 45 67</p>
          </div>
        </div>
        <div className="footer-section">
          <h4>Hot Menu</h4>
          <ul className="menu-links">
            <li><a href="#">Terminal Pizza</a></li>
            <li><a href="#">5 Kişilik Hackathlon Pizza</a></li>
            <li><a href="#">useEffect Tavuklu Pizza</a></li>
            <li><a href="#">Beyaz Console Frosty</a></li>
            <li><a href="#">Testler Geçti Mutlu Burger</a></li>
            <li><a href="#">Position Absolute Acı Burger</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Instagram</h4>
          <div className="social-grid">
            <img loading="lazy" decoding="async" src="/images/iteration-2-images/footer/insta/li-0.png" alt="Instagram post" className="social-image" />
            <img loading="lazy" decoding="async" src="/images/iteration-2-images/footer/insta/li-1.png" alt="Instagram post" className="social-image" />
            <img loading="lazy" decoding="async" src="/images/iteration-2-images/footer/insta/li-2.png" alt="Instagram post" className="social-image" />
            <img loading="lazy" decoding="async" src="/images/iteration-2-images/footer/insta/li-3.png" alt="Instagram post" className="social-image" />
            <img loading="lazy" decoding="async" src="/images/iteration-2-images/footer/insta/li-4.png" alt="Instagram post" className="social-image" />
            <img loading="lazy" decoding="async" src="/images/iteration-2-images/footer/insta/li-5.png" alt="Instagram post" className="social-image" />
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2023 Teknolojik Yemekler.</p>
        <div className="social-icons">
          <a href="#" aria-label="Twitter">
            <img src="images\twitter-icon.png" alt="Twitter" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;