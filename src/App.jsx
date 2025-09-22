import { useState } from "react";
import Header from "./components/Header/Header";
import Home from "./components/Home/Home";
import OrderForm from "./components/OrderForm/OrderForm";
import Success from "./components/Success/Success";
import Footer from "./components/Footer/Footer";
import LoadingSpinner from "./components/LoadingSpinner/LoadingSpinner";
import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [orderData, setOrderData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const navigateTo = (page, product = null) => {
    setCurrentPage(page);
    if (product) setSelectedProduct(product);
  };

  const handleOrderSubmit = (data) => {
    setOrderData(data);
  };

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <Home navigateTo={navigateTo} />;
      case "order":
        return (
          <OrderForm
            navigateTo={navigateTo}
            onSubmit={handleOrderSubmit}
            setIsLoading={setIsLoading}
            selectedProduct={selectedProduct}
          />
        );
      case "success":
        return <Success navigateTo={navigateTo} orderData={orderData} />;
      default:
        return <Home navigateTo={navigateTo} />;
    }
  };

  return (
    <div className="app">
      {currentPage !== "home" && <Header navigateTo={navigateTo} />}
      <main className="main-content">{renderPage()}</main>
      {currentPage === "home" && <Footer />}

      {isLoading && (
        <LoadingSpinner
          duration={5000}    
          successHold={2000}  
          loadingText="Siparişiniz gönderiliyor..."
          successText="Gönderildi!"
          onDone={() => {
            setIsLoading(false);
            setCurrentPage("success"); 
          }}
        />
      )}
    </div>
  );
}

export default App;
