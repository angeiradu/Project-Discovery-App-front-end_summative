import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchBooks } from "./bookService";

interface Book {
  id: number;
  title: string;
  author: string;
}

interface BookState {
  books: Book[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: BookState = {
  books: [],
  loading: false,
  error: null,
};

// Async action to fetch books
export const getBooks = createAsyncThunk("books/fetchBooks", async () => {
  return await fetchBooks();
});

// Create slice
const bookSlice = createSlice({
  name: "books",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload;
      })
      .addCase(getBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load books";
      });
  },
});

export default bookSlice.reducer;
