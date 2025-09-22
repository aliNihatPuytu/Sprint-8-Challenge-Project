import { useState } from "react";
import axios from "axios";

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const makeRequest = async (config) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios({
        ...config,
        timeout: 10000,
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "reqres-free-v1",
          ...config.headers
        }
      });

      return response.data;
    } catch (err) {
      let errorMessage = "Bir hata oluştu";

      if (err.response) {
        errorMessage = err.response.data?.error || `Sunucu hatası: ${err.response.status}`;
      } else if (err.request) {
        errorMessage = "Sunucuya bağlanılamıyor. Lütfen internet bağlantınızı kontrol edin.";
      } else {
        errorMessage = err.message;
      }

      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error, 
    makeRequest
  };
};