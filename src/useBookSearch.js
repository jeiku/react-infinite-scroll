import { useEffect, useState, useRef } from "react";
import axios from "axios";

const OLD_URL = "https://pokeapi.co/api/v2/pokemon";
const URL = "https://openlibrary.org/search.json";

const useBookSearch = (query, pageNumber) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [books, setBooks] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  const abortControllerRef = useRef(null);

  useEffect(() => {
    setBooks([]);
  }, [query]);

  useEffect(() => {
    setIsLoading(true);
    setError(false);

    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    const fetchData = async () => {
      try {
        const response = await axios.get(`${URL}`, {
          params: {
            q: query,
            page: pageNumber,
          },
          signal: abortControllerRef.current?.signal,
        });
        setBooks((prevBooks) => {
          return [
            ...new Set([
              ...prevBooks,
              ...response.data.docs.map((doc) => {
                return doc.title;
              }),
            ]),
          ];
        });

        setHasMore(response.data.docs.length > 0);
        console.log(response.data);
      } catch (error) {
        if (error.name === "CanceledError") {
          console.log("Aborted.");
          return;
        }
        setError(true);
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [query, pageNumber]);

  return { isLoading, error, books, hasMore };
};

export default useBookSearch;
