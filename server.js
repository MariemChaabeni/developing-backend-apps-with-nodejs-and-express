const express = require('express');
const books = require('./booksdb');
const app = express();
app.use(express.json());
const PORT = 3000;

// TASK 1
app.get('/', async (req, res) => {
    try {
        res.json({books:books});
    } catch (error) {
        console.error('Error fetching book list:', error);
        res.status(500).json({ error: 'Failed to fetch book list' });
    }
});
// TASK 2
app.get('/book/:id', async (req, res) => {
    try {
        if(books[req.params.id]){
            res.json(books[req.params.id]);
        }else{
            return res.status(404).json({message: "book not found"});
        }
            
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch book' });
    }
});
// TASK 3 
app.get('/author/:authorName', async (req, res) => {
    try {
        const booksbyAuthor = Object.values(books).filter(book => book.author === req.params.authorName);
        res.json({booksbyAuthor:booksbyAuthor});
            
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch' });
    }
});
// TASK 4
app.get('/title/:title', async (req, res) => {
    try {
        const booksbyTitle = Object.values(books).filter(book => book.title === req.params.title);
        res.json({booksbyTitle:booksbyTitle});
            
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch' });
    }
});
// TASK 5
app.get('/review/:id', async (req, res) => {
    try {
        if(books[req.params.id]){
            res.json(books[req.params.id].reviews);
        }else{
            return res.status(404).json({message: "book not found"});
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch' });
    }
});

// TASK 6
const users = {}; // Simple in-memory store for users
// Register a new user
app.post('/register', async (req, res) => {
    console.log(req.body);
    let { username, password } = req.body;
    users[username] = { username:username, password: password };
    res.status(200).send('Customer successfully registered');
});

// TASK 7
// Register a new user
app.post('/customer/login', async (req, res) => {
    const { username, password } = req.body;
    if(users[username]  && users[username].password=== password){
        res.status(200).send('Customer successfully logged in');
    }else{
        res.status(400).send('username or password incorrect');
    }
});
// TASK 8
app.post('/customer/auth/review/:id', async (req, res) => {
    try {
        const bookId = req.params.id;
        if(books[bookId]){
            const  reviewer  = "mariem"
            const reviewText = req.query.review; // Review text from query parameter
    
            // Check if the book exists
            const book = books[bookId];
    
            // Add or update the review
            book.reviews[reviewer] = reviewText;
            res.status(200).send(`The review for the book ${bookId} has been added/updated successfully`);
        } else {
            res.status(400).send(`Book ${bookId} not found`);
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to added/updated a review' });
    }
});
// TASK 9
app.delete('/customer/auth/review/:id', (req, res) => {
    try {
        const authuser="mariem"
        const bookId = req.params.id;
        const book = books[bookId];
        if (!book) {
            return res.status(404).send(`Book ${bookId} not found`);
        }
        if (book.reviews[authuser]) {
            delete book.reviews[authuser];
            res.status(200).send(`The review for book ${bookId} posted by ${authuser} deleted`);
        } else {
            res.status(404).send(`No review found for book ${bookId} by ${authuser}`);
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete the review' });
    }
});

// TASK 10

async function getAllBooks(callback) {
    try {
        const booksData = await new Promise((resolve) => {
            setTimeout(() => {
                resolve(Object.values(books)); 
            }, 1000); 
        });

        callback(null, booksData);
    } catch (error) {
        callback(error, null); 
    }
}

app.get('/books', (req, res) => {
    getAllBooks((error, books) => {
        if (error) {
            return res.status(500).send('Failed to retrieve books');
        }
        res.status(200).json({books:books}); 
    });
});
// TASK 11
function searchBookById(id) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const book = books[id];
            if (book) {
                resolve(book);
            } else {
                reject(`Book with ID ${id} not found`);
            }
        }, 1000); 
    });
}

app.get('/books/:id', (req, res) => {
    const bookId = req.params.id;

    searchBookById(bookId)
        .then(book => {
            res.status(200).json(book); 
        })
        .catch(error => {
            res.status(404).send(error); 
        });
});

// TASK 12 & 13
// Route to get all books or search by author/title
app.get('/list', async (req, res) => {
    try {
        const { author, title } = req.query;

        let filteredBooks = Object.values(books);

        if (author) {
            filteredBooks = filteredBooks.filter(book => book.author.toLowerCase().includes(author.toLowerCase()));
        }

        if (title) {
            filteredBooks = filteredBooks.filter(book => book.title.toLowerCase().includes(title.toLowerCase()));
        }
        res.json({ books: filteredBooks });
    } catch (error) {
        console.error('Error fetching book list:', error);
        res.status(500).json({ error: 'Failed to fetch book list' });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
