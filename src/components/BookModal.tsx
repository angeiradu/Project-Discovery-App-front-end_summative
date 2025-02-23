import React, { useState } from "react";
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import axios from 'axios';

interface BookModalProps {
  open: boolean;
  onClose: () => void;
}

const BookModal: React.FC<BookModalProps> = ({ open, onClose }) => {
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    year: 1925,
    genre: '',
    description: '',
  });

  const handleAddBook = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      const response = await axios.post(
        'http://localhost:3000/api/books',
        {
          title: newBook.title,
          author: newBook.author,
          year: newBook.year,
          genre: newBook.genre || null,
          description: newBook.description || null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setNewBook({ title: '', author: '', year: 1925, genre: '', description: '' });
        onClose(); // Close modal after adding book
      }
    } catch (err) {
      console.error("Error adding book:", err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Book</DialogTitle>
      <DialogContent>
        <TextField
          label="Title"
          fullWidth
          value={newBook.title}
          onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Author"
          fullWidth
          value={newBook.author}
          onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Year"
          fullWidth
          type="number"
          value={newBook.year}
          onChange={(e) => setNewBook({ ...newBook, year: +e.target.value })}
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Genre"
          fullWidth
          value={newBook.genre}
          onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })}
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Description"
          fullWidth
          value={newBook.description}
          onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
          sx={{ marginBottom: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleAddBook} color="primary">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookModal;
