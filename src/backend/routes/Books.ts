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
    /**
     * @swagger
     * tags:
     *  name: Books
     *  description: The books managing API
     */

    /**
     * @swagger
     * /api/books/all:
     *  get:
     *    summary: Returns a list of all the books
     *    tags: [Books]
     *    security: 
     *      - bearerAuth: []
     *    consumes: 
     *      - application/json
     *    produces: 
     *      - application/json
     *    responses: 
     *      200:
     *        description: An array of all the books (book objects).
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/GetAllBooksResponse'
     *      401:
     *        description: Unauthorized access
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/UnauthorizedAccess'     
     *      500:
     *        description: Internal server error
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/GetAllBooksErrorResponse500'
     */
    // Fetches all the books in the database.
    this.router.get('/all', this.usersController.authenticateToken, this.booksController.getAllBooks);


    /**
     * @swagger
     * /api/books/user/:id:
     *  get:
     *    summary: Returns all the books owned by a user with userID = id.
     *    tags: [Books]
     *    security: 
     *      - bearerAuth: []
     *    consumes: 
     *      - application/json
     *    produces: 
     *      - application/json
     *    parameters:
     *      - in: path
     *        name: id
     *        description: The User ID
     *        schema: 
     *          type: string  
     *        required: true
     *    responses: 
     *      200:
     *        description: Returns a list of books owned by the user
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/GetAllBooksForUserResponse'
     *      401:
     *        description: Unauthorized access
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/UnauthorizedAccess'
     *      404:
     *        description: Books not found for this user
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/GetAllBooksForUserErrorResponse404'     
     *      500:
     *        description: Internal server error
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/GetAllBooksForUserErrorResponse500'
     */
    // Fetches all the books owned/created by a user.
    this.router.get('/user/:id', this.usersController.authenticateToken, this.booksController.getAllBooksByUser);

    // Not in use for now 
    // Fetches a book with book_id == bookID owned by the user 
    // with user_id == userID.
    this.router.get('/:bookID/user/:userID', this.usersController.authenticateToken, this.booksController.getBookByUser);


    /**
     * @swagger
     * /api/books/new:
     *  post:
     *    summary: Adds a book.
     *    tags: [Books]
     *    security: 
     *      - bearerAuth: []
     *    requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            $ref: '#/components/schemas/AddBook'
     *    consumes: 
     *      - application/json
     *    produces: 
     *      - application/json
     *    responses:
     *      200:
     *        description: Book is added successfully
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/AddBookResponse'
     *      400:
     *        description: Bad request
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/AddBookErrorResponse400'
     *      401:
     *        description: Unauthorized access
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/UnauthorizedAccess'
     *      500:
     *        description: Internal server error
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/AddBookErrorResponse500'
     */
    // Add book
    this.router.post('/new', this.usersController.authenticateToken, this.booksController.addBook);


    /**
     * @swagger
     * /api/books/:id:
     *  put:
     *    summary: Updates a book info by book ID.
     *    tags: [Books]
     *    security: 
     *      - bearerAuth: []
     *    consumes: 
     *      - application/json
     *    produces: 
     *      - application/json
     *    parameters:
     *      - in: path
     *        name: id
     *        description: Book ID
     *        schema: 
     *          type: string  
     *        required: true
     *    requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            $ref: '#/components/schemas/UpdateBook'
     *    responses: 
     *      200:
     *        description: Book is updated successfully
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/UpdateBookResponse'
     *      400:
     *        description: Bad request
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/UpdateBookErrorResponse400' 
     *      401:
     *        description: Unauthorized access
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/UnauthorizedAccess'  
     *      404:
     *        description: Book not found
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/UpdateBookErrorResponse404'      
     *      500:
     *        description: Internal server error
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/UpdateBookErrorResponse500'
     */
    // Update book
    this.router.put('/:id', this.usersController.authenticateToken, this.booksController.updateBook);
    

    /**
     * @swagger
     * /api/books/:id:
     *  delete:
     *    summary: Deletes a book by book ID.
     *    tags: [Books]
     *    security: 
     *      - bearerAuth: []
     *    consumes: 
     *      - application/json
     *    produces: 
     *      - application/json
     *    parameters:
     *      - in: path
     *        name: id
     *        description: Book ID
     *        schema: 
     *          type: string  
     *        required: true
     *    responses: 
     *      200:
     *        description: Book is deleted successfully
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/DeleteBookResponse'
     *      401:
     *        description: Unauthorized access
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/UnauthorizedAccess'  
     *      404:
     *        description: Book not found
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/DeleteBookErrorResponse404'      
     *      500:
     *        description: Internal server error
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/DeleteBookErrorResponse500'
     */
    // Delete book
    this.router.delete('/:id', this.usersController.authenticateToken, this.booksController.deleteBook);
  } 
}