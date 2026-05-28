import { useEffect, useState } from "react";
import api from "../services/api";

export const useProducts = (params = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState("database");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/products", { params });
        const apiProducts = data.products || data;
        setProducts(apiProducts);
        setSource("database");
      } catch {
        setProducts([]);
        setSource("offline");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [params.category, params.search]);

  return { products, loading, source };
};
