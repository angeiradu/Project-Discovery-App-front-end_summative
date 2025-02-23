import React, { createContext, useContext, useEffect, useState } from "react";

interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
}

interface BookContextType {
  books: Book[];
  filteredBooks: Book[];
  filterBooks: (query: string) => void;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

export const BookProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (!token) {
      console.error("No token found. Please log in.");
      return;
    }

    const fetchBooks = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/books", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const data: Book[] = await response.json();

        console.log("API Response:", data); // Log the response here

        if (Array.isArray(data)) {
          setBooks(data);
          setFilteredBooks(data);
        } else {
          console.error("Expected an array but got:", data);
          setBooks([]); // Set to empty array if not an array
        }
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, [token]);

  const filterBooks = (query: string) => {
    console.log("Current books state:", books); // Log books state

    if (Array.isArray(books)) {
      const lowerQuery = query.toLowerCase();
      setFilteredBooks(books.filter((book) => book.title.toLowerCase().includes(lowerQuery)));
    } else {
      console.error("Books is not an array:", books);
    }
  };

  return (
    <BookContext.Provider value={{ books, filteredBooks, filterBooks }}>
      {children}
    </BookContext.Provider>
  );
};

export const useBookContext = () => {
  const context = useContext(BookContext);
  if (!context) throw new Error("useBookContext must be used within BookProvider");
  return context;
};