import express from "express";
import { BooksController } from "../controller/BooksController";
import { UsersController } from "../controller/UsersController";

export class Books {

  private booksController = new BooksController();
  private usersController = new UsersController();

  public router = express.Router();

  /**
   * Executes different Book apis.
   * 
   * All protected apis (needs authorization) before processing a request, executes 
   * a middleware function to check if the user is an authorized user.
   */ 
  constructor() {
    // Fetches all the books in the database.
    this.router.get('/all', this.usersController.authenticateToken, this.booksController.getAllBooks);

    // Fetches all the books owned/created by a user.
    this.router.get('/user/:id', this.usersController.authenticateToken, this.booksController.getAllBooksByUser);

    // Fetches a book with book_id == bookID owned by the user 
    // with user_id == userID.
    this.router.get('/:bookID/user/:userID', this.usersController.authenticateToken, this.booksController.getBookByUser);

    // Add book
    this.router.post('/new', this.usersController.authenticateToken, this.booksController.addBook);

    // Update book
    this.router.put('/:id', this.usersController.authenticateToken, this.booksController.updateBook);
    
    // Delete book
    this.router.delete('/:id', this.usersController.authenticateToken, this.booksController.deleteBook);
  } 
}