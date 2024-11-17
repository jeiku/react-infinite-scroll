import { useCallback, useRef, useState } from "react";
import useBookSearch from "./useBookSearch";

function App() {
  const [query, setQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);

  const { books, hasMore, isLoading, error } = useBookSearch(query, pageNumber);

  const observerRef = useRef();
  const lastBookElementRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      // takes all entries that are available. Everything it is watching is in this entries array as soon as they become visible
      observerRef.current = new IntersectionObserver((entries) => {
        // only ever observing one single node
        // if our first entry (our node) is intersecting (MEANING ON THE PAGE SOMEWHERE)
        if (entries[0].isIntersecting) {
          setPageNumber((prevPage) => prevPage + 1);
          console.log("VISIBLE");
        }
      });

      // if we have a node (if something IS our last element)
      // then observe that element
      if (node) {
        observerRef.current.observe(node);
      }
      console.log(node);

      // just like all hooks that use callbacks, this has dependencies
    },
    [isLoading, hasMore]
  );

  const handleSearch = (e) => {
    setQuery(e.target.value);
    setPageNumber(1);
  };

  return (
    <>
      <input type='text' value={query} onChange={handleSearch}></input>
      {query &&
        books.map((book, index) => {
          if (books.length === index + 1) {
            return (
              <div ref={lastBookElementRef} key={book}>
                {book}
              </div>
            );
          } else {
            return <div key={book}>{book}</div>;
          }
        })}
      <div>{isLoading && "Loading..."}</div>
      <div>{error && "ERROR"}</div>
    </>
  );
}

export default App;
