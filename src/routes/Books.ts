import express from 'express';
import { BooksController } from '../controller/BooksController';
import { UsersController } from '../controller/UsersController';

export class Books {

  private booksController = new BooksController();
  private usersController = new UsersController();

  public router = express.Router();


  /**
   * Executes different Book apis.
   * 
   * All protected apis (needs authorization) before processing a 
   * request, executes a middleware function to check if the user 
   * is an authorized user.
   * 
   */ 
  constructor() {

    // Fetches all the books in the database.
    this.router.get('/all', (req, res, next) => {
      this.usersController.authenticateToken(req, res, next);
    }, (req, res) => {
      this.booksController.getAllBooks(req, res);
    });


    // Fetches all the books owned/created by a user.
    this.router.get('/user/:id', (req, res, next) => {
      this.usersController.authenticateToken(req, res, next);
    }, (req, res) => {
      this.booksController.getAllBooksByUser(req, res);
    })


    // Fetches a book with book_id == bookID owned by the user 
    // with user_id == userID.
    this.router.get('/:bookID/user/:userID', (req, res, next) => {
      this.usersController.authenticateToken(req, res, next);
    }, (req, res) => {
      this.booksController.getBookByUser(req, res);
    })


    // Add book
    this.router.post('/new', (req, res, next) => {
      this.usersController.authenticateToken(req, res, next);
    }, (req, res) => {
      this.booksController.addBook(req, res);
    });


    // Update book
    this.router.put('/:id', (req, res, next) => {
      this.usersController.authenticateToken(req, res, next);
    }, (req, res) => {
      this.booksController.updateBook(req, res);
    });
    
    
    // Delete book
    this.router.delete('/:id', (req, res, next) => {
      this.usersController.authenticateToken(req, res, next);
    }, (req, res) => {
      this.booksController.deleteBook(req, res);
    });
  }
  
}