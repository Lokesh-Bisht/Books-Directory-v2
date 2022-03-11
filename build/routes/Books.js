"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Books = void 0;
const express_1 = __importDefault(require("express"));
const BooksController_1 = require("../controller/BooksController");
const UsersController_1 = require("../controller/UsersController");
class Books {
    /**
     * Executes different Book apis.
     *
     * All protected apis (needs authorization) before processing a
     * request, executes a middleware function to check if the user
     * is an authorized user.
     *
     */
    constructor() {
        this.booksController = new BooksController_1.BooksController();
        this.usersController = new UsersController_1.UsersController();
        this.router = express_1.default.Router();
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
        });
        // Fetches a book with book_id == bookID owned by the user 
        // with user_id == userID.
        this.router.get('/:bookID/user/:userID', (req, res, next) => {
            this.usersController.authenticateToken(req, res, next);
        }, (req, res) => {
            this.booksController.getBookByUser(req, res);
        });
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
exports.Books = Books;
