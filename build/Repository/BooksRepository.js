"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BooksRepository = void 0;
const Book_1 = require("../entity/Book");
const typeorm_1 = require("typeorm");
/**
 * Class for interacting with the Books table in the database.
 *
 * This class makes use of Book entity which represents a row in the
 * Books table.
 */
class BooksRepository {
    constructor() { }
    /**
     * Fetches all books present in the Books table.
     * @param req
     * @returns Books, undefined or SQL error
     */
    fetchAllBooks(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield (0, typeorm_1.getRepository)(Book_1.Book)
                    .createQueryBuilder("books")
                    .getMany();
            }
            catch (error) {
                return error;
            }
        });
    }
    /**
     * Returns a book from the Books table with book_id === id.
     * @param id
     * @returns Book, undefined or SQL error
     */
    getBookById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield (0, typeorm_1.getRepository)(Book_1.Book)
                    .createQueryBuilder("books")
                    .where("books.id = :id", { id: id })
                    .getOne();
            }
            catch (error) {
                return error;
            }
        });
    }
    /**
     * Adds a new book to the books table
     * @param req
     * @returns
     */
    addNewBook(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield (0, typeorm_1.getConnection)()
                    .createQueryBuilder()
                    .insert()
                    .into(Book_1.Book)
                    .values([
                    {
                        title: req.body.title,
                        description: req.body.description,
                        coverImage: req.body.coverImage,
                        userID: req.body.userID
                    }
                ])
                    .execute();
            }
            catch (error) {
                return error;
            }
        });
    }
    /**
     * Updates a book in the Books table
     * @param req
     * @returns
     */
    updateBook(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield (0, typeorm_1.getConnection)()
                    .createQueryBuilder()
                    .update(Book_1.Book)
                    .set({
                    title: req.body.title,
                    description: req.body.description,
                    coverImage: req.body.coverImage
                })
                    .where("id = :id", { id: req.params.id })
                    .execute();
            }
            catch (error) {
                return error;
            }
        });
    }
    /**
     * Deletes a book from the Books table
     * @param id
     * @returns
     */
    deleteBook(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield (0, typeorm_1.getConnection)()
                    .createQueryBuilder()
                    .delete()
                    .from(Book_1.Book)
                    .where("id = :id", { id: id })
                    .execute();
            }
            catch (error) {
                return error;
            }
        });
    }
    /**
     * Returns all the books from the Books table which are owned by the
     * user with user_id === userID
     *
     * @param userID
     * @returns Books, undefined or SQL error
     */
    getAllBooksWithUserID(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield (0, typeorm_1.getRepository)(Book_1.Book)
                    .createQueryBuilder("books")
                    .where("books.userID = :id", { id: userID })
                    .getMany();
            }
            catch (error) {
                return error;
            }
        });
    }
    /**
     * Returns a book with book_id === bookID from the Books table
     * that is owned by the user with user_id === userID.
     *
     * @param userID
     * @param bookID
     * @returns Book, undefined or SQL error
     */
    getBookWithUserID(userID, bookID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield (0, typeorm_1.getRepository)(Book_1.Book)
                    .createQueryBuilder("books")
                    .where("books.userID = :userID AND books.id = :id", { userID: userID, id: bookID })
                    .getOne();
            }
            catch (error) {
                return error;
            }
        });
    }
}
exports.BooksRepository = BooksRepository;
