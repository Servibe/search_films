import { useState, useRef, useMemo, useCallback } from "react";
import { searchMovies } from "../services/movies";

export function useMovies({ search, sort }) {
  // Estados de las peliculas
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Indicador para saber si el termino buscado es el mismo que el anterior
  const previousSearch = useRef(search);

  // Función para obtener los datos de las peliculas
  // useCallback (funciones) es para memorizar el valor de getMovies en memoria y evitar repetir la computación
  const getMovies = useCallback(async ({ search }) => {
    // Si el termino buscado es el mismo que el anterior, se debe retornar
    if (search === previousSearch.current) {
      return;
    }

    // Si hay una búsqueda, se debe obtener los datos de las peliculas
    try {
      setLoading(true);
      setError(null);
      previousSearch.current = search;

      const newMovies = await searchMovies({ search });

      setMovies(newMovies);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Ordenar las peliculas
  // useMemo (cualquier cosa) es para memorizar el valor de sortedMovies en memoria y evitar repetir la computación
  const sortedMovies = useMemo(() => {
    // Si no se debe ordenar las peliculas, se debe retornar las peliculas sin ordenar
    return sort
      ? [...movies].sort((a, b) => a.title.localeCompare(b.title))
      : movies;
  }, [sort, movies]);

  return {
    movies: sortedMovies,
    loading,
    getMovies,
  };
}
