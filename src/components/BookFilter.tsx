import React, { useState } from "react";
import { useBookContext } from "../context/BookContext";

const BookFilter: React.FC = () => {
  const { filterBooks } = useBookContext();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    filterBooks(query);
  };

  return (
    <input
      type="text"
      placeholder="Search by title..."
      value={searchQuery}
      onChange={handleSearch}
      className="border p-2 rounded w-full"
    />
  );
};

export default BookFilter;