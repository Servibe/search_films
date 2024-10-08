import "./App.css";
import { useState, useEffect, useRef, useCallback } from "react";
import { useMovies } from "./hooks/useMovies";
import { Movies } from "./components/Movies";
import debounce from "just-debounce-it";

function useSearch() {
  // Estados de la busqueda
  const [search, updateSearch] = useState("");
  const [error, setError] = useState(null);
  // Indicador para saber si es la primera vez que se ejecuta el hook (bandera de primera entrada)
  const isFirstInput = useRef(true);

  // Validar la entrada del usuario
  useEffect(() => {
    // Si es la primera vez que se ejecuta el hook, se debe validar la entrada del usuario
    if (isFirstInput.current) {
      isFirstInput.current = search === "";

      return;
    }

    if (search === "") {
      setError("No se puede buscar una pelicula vacía");

      return;
    }

    if (search.match(/^\d+$/)) {
      setError("No se puede buscar por un número");

      return;
    }

    if (search.length < 3) {
      setError("La longitud mínima de la pelicula es de 3 caracteres");

      return;
    }

    setError(null);
  }, [search]);

  return { search, updateSearch, error };
}

function App() {
  const [sort, setSort] = useState(false);
  // Custom hook para realizar la búsqueda
  const { search, updateSearch, error } = useSearch();
  // Custom hook para obtener los datos de las peliculas
  const { movies, loading, getMovies } = useMovies({ search, sort });

  const debouncedGetMovies = useCallback(
    debounce((search) => {
      getMovies({ search });
    }, 300),
    []
  );

  // Función para buscar las peliculas
  const handleSubmit = (event) => {
    event.preventDefault();

    getMovies({ search });
  };

  // Ordenar las peliculas
  const handleSort = () => {
    setSort(!sort);
  };

  // Cambiar el valor del input
  const handleChange = (event) => {
    const newSearch = event.target.value;

    updateSearch(newSearch);
    debouncedGetMovies(newSearch);
  };

  return (
    <div className="page">
      <header>
        <h1>Buscador de peliculas</h1>
        <form className="form" onSubmit={handleSubmit}>
          <input
            onChange={handleChange}
            value={search}
            name="query"
            placeholder="Avengers, Matrix, Legends..."
          />
          <input type="checkbox" onChange={handleSort} checked={sort} />
          <button type="submit">Buscar</button>
        </form>
        {error && <p className="error">{error}</p>}
      </header>

      <main>{loading ? <p>Cargando...</p> : <Movies movies={movies} />}</main>
    </div>
  );
}

export default App;
