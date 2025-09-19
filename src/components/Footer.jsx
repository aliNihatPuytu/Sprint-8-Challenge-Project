import React from "react";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-logo">
            <img src="/images/iteration-2-images/footer/logo-footer.svg" alt="Teknolojik Yemekler" />
          </div>
          <div className="footer-links">
            <a href="#">Anasayfa</a>
            <a href="#">Sipariş Oluştur</a>
            <a href="#">Hakkımızda</a>
            <a href="#">İletişim</a>
          </div>
          <div className="footer-social">
            <a href="#"><img src="/images/iteration-2-images/footer/icons/1.svg" alt="Facebook" /></a>
            <a href="#"><img src="/images/iteration-2-images/footer/icons/2.svg" alt="Twitter" /></a>
            <a href="#"><img src="/images/iteration-2-images/footer/icons/3.svg" alt="Instagram" /></a>
            <a href="#"><img src="/images/iteration-2-images/footer/icons/4.svg" alt="LinkedIn" /></a>
            <a href="#"><img src="/images/iteration-2-images/footer/icons/5.svg" alt="YouTube" /></a>
            <a href="#"><img src="/images/iteration-2-images/footer/icons/6.svg" alt="GitHub" /></a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2023 Teknolojik Yemekler. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer;