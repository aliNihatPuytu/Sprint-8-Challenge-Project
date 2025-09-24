import React from "react";
import "./Header.css";

const Header = ({ navigateTo }) => {
  return (
    <header className="main-header">
      <div className="container">
        <div className="header-content">
          <img
            src="/images/iteration-1-images/logo.svg"
            alt="Teknolojik Yemekler"
            className="site-logo"
            onClick={() => navigateTo("home")}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
