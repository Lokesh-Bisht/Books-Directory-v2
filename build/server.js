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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const express_1 = __importDefault(require("express"));
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const cors_1 = __importDefault(require("cors"));
const Books_1 = require("./routes/Books");
const Users_1 = require("./routes/Users");
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000; // INITIALIZE DEFAULT PORT OR PORT FROM ENVIRONMENT VARIABLE
(0, typeorm_1.createConnection)().then((connection) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Inserting a new user into the database...");
    app.use(body_parser_1.default.json());
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: false }));
    /**
     * To allow browser to save cookies.
     *
     * Add frontend urls in the origin to whitelist them and
     * set credentials to true.
     */
    var corsOptions = {
        origin: ['http://localhost:3000', 'http://localhost:3000/register'],
        credentials: true,
        optionsSuccessStatus: 200
    };
    // some legacy browsers (IE11, various SmartTVs) choke on 204
    app.use((0, cors_1.default)(corsOptions));
    const booksRouter = new Books_1.Books();
    const usersRouter = new Users_1.Users();
    app.use('/api/books', booksRouter.router);
    app.use('/api/users', usersRouter.router);
    app.listen(port, () => {
        console.log('Sever running on port 8080');
    });
})).catch(error => console.log(error));
