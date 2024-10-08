// API KEY
const API_KEY = "96ae20f4";

// Función para obtener los datos de las peliculas
export const searchMovies = async ({ search }) => {
  // Si hay una búsqueda, se debe obtener los datos de las peliculas
  if (search === "") {
    return null;
  }

  // Obtener los datos de las peliculas
  try {
    const response = await fetch(
      `https://www.omdbapi.com/?apikey=${API_KEY}&s=${search}`
    );
    const json = await response.json();

    const movies = json.Search;

    return movies?.map((movie) => ({
      id: movie.imdbID,
      title: movie.Title,
      year: movie.Year,
      poster: movie.Poster,
    }));
  } catch (error) {
    // Si no se pudo obtener los datos de las peliculas, se debe lanzar un error
    throw new Error("No se pudo obtener los datos de las peliculas");
  }
};
