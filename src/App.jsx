// App.jsx
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

  return (
    <div className="min-h-screen flex flex-col">
      {currentPage !== "home" && currentPage !== "success" && (
        <Header navigateTo={navigateTo} />
      )}

      <main className="flex-1">
        {currentPage === "home" && <Home navigateTo={navigateTo} />}

        {currentPage === "order" && (
          <OrderForm
            navigateTo={navigateTo}
            onSubmit={handleOrderSubmit}
            setIsLoading={setIsLoading}
            selectedProduct={selectedProduct}
          />
        )}

        {currentPage === "success" && (
          <Success navigateTo={navigateTo} orderData={orderData} />
        )}
      </main>

      {currentPage !== "success" && <Footer />}

      {isLoading && (
        <LoadingSpinner
          duration={1000}
          successHold={1000}
          onDone={() => {
            setIsLoading(false);
            navigateTo("success");
          }}
        />
      )}
    </div>
  );
}

export default App;
