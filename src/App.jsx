import { useState } from "react";
import Header from "./components/Header/Header";
import Home from "./components/Home/Home";
import OrderForm from "./components/OrderForm/OrderForm";
import Success from "./components/Success/Success";
import Footer from "./components/Footer/Footer";
import "./App.css";

function App() {
    const [currentPage, setCurrentPage] = useState("home");
    const [orderData, setOrderData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const navigateTo = (page) => {
        setCurrentPage(page);
    }

    const handleOrderSubmit = (data) => {
    setOrderData(data);
    setCurrentPage("success");
    }

    const renderPage = () => {
        switch (currentPage) {
            case "home":
                return <Home navigateTo={navigateTo} />
            case "order":
                return <OrderForm
                        navigateTo={navigateTo}
                        onSubmit={handleOrderSubmit}
                        setIsLoading={setIsLoading} 
                />
            case "success":
                return <Success
                        navigateTo={navigateTo}
                        orderData={orderData}
                        />
            default:
                return <Home navigateTo={navigateTo} />
        }
    }

    return (
        <div className="app">
            <Header />
            <main className="main-content">
                {renderPage()}
            </main>
            <Footer />
            {isLoading && (
                <div className="loading-overlay">
                    <div className="loading-spinner">Siparişiniz gönderiliyor...</div>
                </div>
            )}
        </div>
    )
}

export default App