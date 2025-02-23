import React, { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError } from 'axios';
import { Container, Grid, Typography, CircularProgress, Alert, Box, Card, CardContent, CardActions, Button, Chip, IconButton, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Paper } from '@mui/material';
import { Book as BookIcon, Info as InfoIcon, Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { blue, purple, green, grey } from '@mui/material/colors';
import BookModal from '../components/BookModal';

import CloseIcon from '@mui/icons-material/Close';

const HomePage: React.FC = () => {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // State for success message
  const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);
 
  const [editedBook, setEditedBook] = useState({ title: '', author: '', year: '', genre: '', description: '' });
  const [editedBookDetails, setEditedBookDetails] = useState({ title: '', author: '', year: '', genre: '', description: '' });
  const [selectedBook, setSelectedBook] = useState<number | string | null>(null);
  const [selectedBookDetails, setSelectedBookDetails] = useState<number | string | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null); // Clear the success message on each fetch

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('No token found. Please log in.');
        return;
      }

      const response = await axios.get('http://localhost:3000/api/books', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setBooks(response.data.data); // Set all books without pagination
      } else {
        setError('Failed to retrieve books.');
      }
    } catch (err: unknown) {
      if ((err as AxiosError).response?.status === 403) {
        setError('Access forbidden. Please check your login status or permissions.');
      } else {
        setError('Failed to fetch books. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  
  
  const handleEditClick = async (bookId: string | number) => {
  
    const token = localStorage.getItem('authToken');
  
    try {
      const response = await axios.get(`http://localhost:3000/api/books/${bookId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (!response.data) {
        console.error('No book data returned from API');
        return;
      }
  
      // Ensure the correct response format
      const bookData = response.data.data; // Adjust based on API
  
      setEditedBook({
        title: bookData.title || '',
        author: bookData.author || '',
        year: bookData.year ? bookData.year.toString() : '', // Convert to string for TextField
        genre: bookData.genre || '',
        description: bookData.description || '',
      });
  
      setSelectedBook(bookId);
      setOpenEditDialog(true);
    } catch (error) {
      console.error('Error fetching book details:', error);
      setError('Failed to fetch book details.');
    }
  };

  const handleViewDetails = async (bookId: string | number) => {
  
    const token = localStorage.getItem('authToken');
  
    try {
      const response = await axios.get(`http://localhost:3000/api/books/${bookId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (!response.data) {
        console.error('No book data returned from API');
        return;
      }
  
      // Ensure the correct response format
      const bookData = response.data.data; // Adjust based on API
  
      setEditedBookDetails({
        title: bookData.title || '',
        author: bookData.author || '',
        year: bookData.year ? bookData.year.toString() : '', // Convert to string for TextField
        genre: bookData.genre || '',
        description: bookData.description || '',
      });
  
      setSelectedBookDetails(bookId);
      setOpenModal(true);
    } catch (error) {
      console.error('Error fetching book details:', error);
      setError('Failed to fetch book details.');
    }
  };
  
  useEffect(() => {
    if (selectedBook) {
      handleEditClick(selectedBook);
    }
  }, [selectedBook]);
  useEffect(() => {
    if (selectedBookDetails) {
      handleEditClick(selectedBookDetails);
    }
  }, [selectedBookDetails]);
  const handleUpdateBook = async () => {
    if (!selectedBook) return;

    const token = localStorage.getItem('authToken');

    try {
      await axios.put(`http://localhost:3000/api/books/${selectedBook}`, editedBook, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccessMessage('Book updated successfully!');
      setOpenEditDialog(false);
      fetchBooks(); // Refresh the book list after update
    } catch (error) {
      console.error('Error saving book details:', error);
    }
  };
  const handleDeleteBook = async (bookId: number) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('No token found. Please log in.');
      return;
    }
  
    try {
      const response = await axios.delete(`http://localhost:3000/api/books/${bookId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      console.log("Delete response:", response.data); // Debugging
  
      if (response.data?.success) {
        setSuccessMessage('Book deleted successfully!');
        setBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookId));
      } else {
        setError('Failed to delete book. Response format incorrect.');
      }
    } catch (err) {
      console.error("Delete error:", err);
      setError('Error occurred while deleting the book. Please try again.');
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);
  return (
    <Container maxWidth="lg" sx={{ marginTop: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ color: blue[800], fontWeight: 'bold' }}>
        Welcome to the Book Library
      </Typography>

      <Box display="flex" justifyContent="flex-end" sx={{ marginBottom: 4 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpenAddDialog(true)}
        >
          Add New Book
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: '200px' }}>
          <CircularProgress sx={{ color: blue[500] }} />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ marginBottom: 2 }}>
          {error}
        </Alert>
      ) : (
        <>
          {successMessage && (
            <Alert severity="success" sx={{ marginBottom: 2 }}>
              {successMessage}
            </Alert>
          )}
          <BookModal
            open={openAddDialog}
            onClose={() => {
              setOpenAddDialog(false);
              fetchBooks();
            }}
          />

<TextField
      fullWidth
      variant="outlined"
      placeholder="Search books by title or author"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      sx={{
        marginBottom: 2, // spacing between input and other elements
        borderRadius: 2, // rounded corners
        '& .MuiOutlinedInput-root': {
          borderRadius: 2, // rounded corners for the input itself
        },
        '& .MuiInputBase-input': {
          padding: '12px 14px', // padding inside the input
        },
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: '#ddd', // light border color
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: '#aaa', // darker border color when hovering
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: '#3f51b5', // border color on focus
        },
      }}
    />

      {/* Check if filteredBooks is empty and show message */}
      {filteredBooks.length === 0 ? (
        <Typography variant="h6" color="textSecondary" sx={{ textAlign: 'center', marginTop: '20px' }}>
          No books found.
        </Typography>
      ) : (
        // Book Grid
        <Grid container spacing={4}>
          {filteredBooks.map((book) => (
            <Grid item xs={12} sm={6} md={4} key={book.id}>
              <Card
                elevation={8}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 4,
                  boxShadow: 12,
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': { transform: 'scale(1.05)', boxShadow: 16 },
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    backgroundColor: purple[100],
                    padding: 3,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <BookIcon sx={{ fontSize: 64, color: purple[500] }} />
                </Box>

                <CardContent sx={{ flexGrow: 1, padding: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: blue[700], textAlign: 'center' }}>
                    {book.title}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ color: grey[600], textAlign: 'center', marginBottom: 1 }}>
                    by {book.author}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 2, textAlign: 'center' }}>
                    {book.description ? book.description : 'No description available.'}
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Chip
                      label={`Published: ${book.year}`}
                      color="primary"
                      size="small"
                      sx={{ backgroundColor: green[300], color: grey[900], fontWeight: 'bold' }}
                    />
                  </Box>
                </CardContent>

                <CardActions sx={{ justifyContent: 'space-between', padding: '16px' }}>
                  <IconButton sx={{ color: purple[500] }} onClick={() => alert('More info about the book')}>
                    <InfoIcon />
                  </IconButton>
                  <Button
                    size="small"
                    variant="contained"
                    sx={{
                      backgroundColor: blue[500],
                      color: '#fff',
                      '&:hover': { backgroundColor: blue[700] },
                      borderRadius: 25,
                      textTransform: 'none',
                    }}
                    onClick={() => handleViewDetails(book.id)}
                  >
                    View Details
                  </Button>
                  <IconButton sx={{ color: blue[500] }} onClick={() => handleEditClick(book.id)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton sx={{ color: grey[500] }} onClick={() => handleDeleteBook(book.id)}>
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
        </>
      )}
          <Dialog
      open={openModal}
      onClose={() => setOpenModal(false)}
      maxWidth="sm"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 3, 
          padding: 3,
          backgroundColor: '#f9f9f9',
        },
      }}
    >
      <IconButton
        onClick={() => setOpenModal(false)}
        sx={{
          position: 'absolute',
          right: 10,
          top: 10,
          color: '#666',
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogTitle
        sx={{
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: 22,
          color: '#333',
          borderBottom: '2px solid #ddd',
          pb: 1,
        }}
      >
        📖 Book Details
      </DialogTitle>

      <DialogContent>
        {editedBookDetails ? (
          <Paper
            elevation={3}
            sx={{
              backgroundColor: '#fff',
              borderRadius: 2,
              padding: 3,
              textAlign: 'center',
              boxShadow: 3,
            }}
          >
            <Typography
              variant="h5"
              sx={{ fontWeight: 'bold', color: '#444', mb: 1 }}
            >
              {editedBookDetails.title}
            </Typography>

            <Typography
              variant="subtitle1"
              sx={{ color: '#777', fontStyle: 'italic', mb: 1 }}
            >
              ✍️ Author: {editedBookDetails.author}
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: '#333',
                backgroundColor: '#f1f1f1',
                padding: 2,
                borderRadius: 2,
                textAlign: 'justify',
                fontSize: 14,
              }}
            >
              {editedBookDetails.description}
            </Typography>
          </Paper>
        ) : (
          <Typography
            variant="body1"
            sx={{ textAlign: 'center', color: '#999', mt: 2 }}
          >
            No book details available.
          </Typography>
        )}
      </DialogContent>
    </Dialog>
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Book</DialogTitle>
        <DialogContent>
          <TextField label="Title" fullWidth margin="dense" value={editedBook.title} onChange={(e) => setEditedBook({ ...editedBook, title: e.target.value })} />
          <TextField label="Author" fullWidth margin="dense" value={editedBook.author} onChange={(e) => setEditedBook({ ...editedBook, author: e.target.value })} />
          <TextField label="Year" fullWidth margin="dense" type="number" value={editedBook.year} onChange={(e) => setEditedBook({ ...editedBook, year: e.target.value })} />
          <TextField label="Genre" fullWidth margin="dense" value={editedBook.genre} onChange={(e) => setEditedBook({ ...editedBook, genre: e.target.value })} />
          <TextField label="Description" fullWidth margin="dense" multiline rows={3} value={editedBook.description} onChange={(e) => setEditedBook({ ...editedBook, description: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdateBook} variant="contained" color="primary">Save</Button>
        </DialogActions>
      </Dialog>
      
    </Container>
  );
};

export default HomePage;