"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = void 0;
const express_1 = __importDefault(require("express"));
const UsersController_1 = require("../controller/UsersController");
class Users {
    constructor() {
        this.router = express_1.default.Router();
        this.usersController = new UsersController_1.UsersController();
        // Sign up
        this.router.post('/register', (req, res) => this.usersController.registerUser(req, res));
        // Log in 
        this.router.post('/login', (req, res) => this.usersController.authenticateUser(req, res));
        // After successfull log in redirect the user to his/her profile
        this.router.get('/:id', (req, res, next) => {
            this.usersController.authenticateToken(req, res, next);
        }, (req, res) => {
            this.usersController.fetchUserInfo(req, res);
        });
    }
}
exports.Users = Users;
