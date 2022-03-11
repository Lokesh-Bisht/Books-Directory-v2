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
exports.UsersRepository = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("../entity/User");
/**
 * Class for interacting with the Users table in the database.
 *
 * This class makes use of User entity which represents a row in the
 * Users table.
 */
class UsersRepository {
    constructor() { }
    /**
     * Adds a new user to the Users table
     * @param userInfo
     * @returns
     */
    addUser(userInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield (0, typeorm_1.getConnection)()
                    .createQueryBuilder()
                    .insert()
                    .into(User_1.User)
                    .values([
                    {
                        username: userInfo.username,
                        email: userInfo.email,
                        password: userInfo.password
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
     * Returns User { userID, username, password} from the Users table
     * where username === userInfo.username
     *
     * @param userInfo
     * @returns User, undefined or SQL error
     */
    findUser(userInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, email, password } = userInfo;
            console.log(userInfo);
            try {
                return yield (0, typeorm_1.getConnection)()
                    .createQueryBuilder()
                    .select(["user.userID", "user.username", "user.password"])
                    .from(User_1.User, "user")
                    .where("user.username = :username", { username: username })
                    .getOne();
            }
            catch (error) {
                return error;
                // console.log(error);
                // return "An error occurred while processing request.";
            }
        });
    }
    /**
     * Returns User { username, email} from the Users table
     * where userID === userInfo.userID
     * @param userID
     * @returns User, undefiend or SQL error
     */
    getUserById(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield (0, typeorm_1.getConnection)()
                    .createQueryBuilder()
                    .select(["user.username", "user.email"])
                    .from(User_1.User, "user")
                    .where("user.userID = :userID", { userID: userID })
                    .getOne();
            }
            catch (error) {
                return error;
            }
        });
    }
    /**
     * Returns email if the email address is present in the Users table.
     * @param email
     * @returns email, undefined or SQL error
     */
    checkIfEmailExists(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield (0, typeorm_1.getConnection)()
                    .createQueryBuilder()
                    .select(["user.email"])
                    .from(User_1.User, "user")
                    .where("user.email = :email", { email: email })
                    .getOne();
            }
            catch (error) {
                return error;
            }
        });
    }
    /**
     * Returns username if the username is present in the Users table.
     * @param username
     * @returns username, undefined or SQL error
     */
    checkIfUsernameExists(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield (0, typeorm_1.getConnection)()
                    .createQueryBuilder()
                    .select(["user.username"])
                    .from(User_1.User, "user")
                    .where("user.username = :username", { username: username })
                    .getOne();
            }
            catch (error) {
                return error;
            }
        });
    }
}
exports.UsersRepository = UsersRepository;
