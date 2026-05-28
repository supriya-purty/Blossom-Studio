import { useEffect, useState } from "react";
import api from "../services/api";

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [source, setSource] = useState("database");
  const [loading, setLoading] = useState(false);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/categories");
      setCategories(data);
      setSource("database");
    } catch {
      setCategories([]);
      setSource("offline");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return { categories, loading, source, reload: loadCategories };
};
