import { useState, useEffect } from "react";
import Header from "./components/Header/Header";
import Home from "./components/Home/Home";
import OrderForm from "./components/OrderForm/OrderForm";
import Success from "./components/Success/Success";
import Footer from "./components/Footer/Footer";
import LoadingSpinner from "./components/LoadingSpinner/LoadingSpinner";
import "./App.css";

function App() {
  const getPageFromHash = () => {
    const h = window.location.hash.replace(/^#\/?/, "");
    return ["home", "order", "success"].includes(h) ? h : "home";
  };

  const [currentPage, setCurrentPage] = useState(getPageFromHash());
  const [orderData, setOrderData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const navigateTo = (page, product = null) => {
    setCurrentPage(page);
    if (product) setSelectedProduct(product);
    window.location.hash = `/${page}`;
  };

  useEffect(() => {
    const onHashChange = () => setCurrentPage(getPageFromHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const handleOrderSubmit = (data) => setOrderData(data);

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
