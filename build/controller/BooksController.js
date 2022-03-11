"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BooksController = void 0;
const BooksRepository_1 = require("../Repository/BooksRepository");
/**
 * A class for processing user requests like add, update and delete book.
 * And for fetching all books or books associated with a user.
 */
class BooksController {
    // private repository: BooksRepository;
    // constructor(repository: BooksRepository) {
    //   this.repository = repository;
    // }
    // Get all Books
    getAllBooks(req, res) {
        new BooksRepository_1.BooksRepository().fetchAllBooks(req)
            .then(data => res.status(200).json({ sucess: true, books: data }))
            .catch(error => res.status(400).json({ error }));
    }
    // Get a book by id
    getBook(req, res) {
        let id = parseInt(req.params.id);
        new BooksRepository_1.BooksRepository().getBookById(id)
            .then((data) => {
            if (data === undefined) {
                res.status(404).json({ success: false, msg: `Failed to find book with id: ${id}` });
            }
            else {
                res.status(200).json({ success: true, book: data });
            }
        })
            .catch(error => res.status(400).json({ error }));
    }
    // Add a book
    addBook(req, res) {
        const { userID, title, description, coverImage } = req.body;
        // If userID, title, summary or coverImage is null
        if (!title || !description || !coverImage || !userID) {
            return res.status(400).json({ success: false, msg: 'Incomplete info. Failed to add this book.' });
        }
        new BooksRepository_1.BooksRepository().addNewBook(req)
            .then(() => res.status(200).json({ success: true, msg: 'Book added' }))
            .catch(error => res.status(400).json({ success: false, msg: 'Failed to add book', error: error }));
    }
    // Update a book
    updateBook(req, res) {
        const { title, description, coverImage } = req.body;
        // If title, summary or coverImage is null
        if (!title || !description || !coverImage) {
            return res.status(400).json({ success: false, msg: 'Update failed. Incomplete info.' });
        }
        new BooksRepository_1.BooksRepository().updateBook(req)
            .then((data) => {
            console.log(data);
            if (data.affected == 0) {
                res.status(404).json({ success: false, msg: `Failed to find book with id: ${req.params.id}` });
            }
            else {
                res.status(200).json({ success: true, msg: 'Book updated' });
            }
        })
            .catch(error => res.status(400).json({ error }));
    }
    // Delete a book
    deleteBook(req, res) {
        let id = parseInt(req.params.id);
        new BooksRepository_1.BooksRepository().deleteBook(id)
            .then((data) => {
            console.log(data);
            if (data.affected === 0) {
                res.status(404).json({ success: false, msg: `Failed to find book for id: ${id}` });
            }
            else {
                res.status(200).json({ success: true, msg: 'Book deleted' });
            }
        })
            .catch(error => res.status(400).json({ error }));
    }
    // Get all books for a user with userID
    getAllBooksByUser(req, res) {
        let userID = req.params.id;
        new BooksRepository_1.BooksRepository().getAllBooksWithUserID(userID)
            .then((data) => {
            if (data === undefined) {
                res.status(404).json({ success: false, msg: `Failed to find 
        books for user ${userID}` });
            }
            else {
                res.status(200).json({ success: true, book: data });
            }
        })
            .catch(error => res.status(400).json({ error }));
    }
    // Get a book with ID for a user with userID
    getBookByUser(req, res) {
        let userID = req.params.userID;
        let bookID = Number(req.params.bookID);
        new BooksRepository_1.BooksRepository().getBookWithUserID(userID, bookID)
            .then((data) => {
            if (data === undefined) {
                res.status(404).json({ success: false, msg: `Failed to find 
        book ${bookID} for user ${userID}` });
            }
            else {
                res.status(200).json({ success: true, book: data });
            }
        })
            .catch(error => res.status(400).json({ error }));
    }
}
exports.BooksController = BooksController;
