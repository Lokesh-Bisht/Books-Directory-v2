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
exports.UsersController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
const UsersRepository_1 = require("../Repository/UsersRepository");
dotenv_1.default.config();
/**
 * A class for processing user requests like user registration, login,
 * user validation and fetching user info.
 */
class UsersController {
    /**
     * This method validates access token sent by the client.
     *
     * It first checks if the request sent by the client contains
     * cookies in its header or not.
     *
     * If yes, then check if the Cookies has a Cookie called
     * 'Authorization'.
     *
     * Retrieve the access token associated with the 'Authorization' cookie
     * and check if it is a valid token.
     */
    authenticateToken(req, res, next) {
        const authHeader = req.headers.cookie;
        // console.log(authHeader);
        if (authHeader === undefined) {
            return res.status(403).json({ error: "User is not logged in." });
        }
        const cookies = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(';');
        const cookiesMap = new Map();
        cookies.forEach(cookie => {
            const keyValue = cookie.split('=');
            // .replace(/ /g, '');  => to remove spaces from the string
            cookiesMap.set(keyValue[0].replace(/ /g, ''), keyValue[1]);
        });
        // console.log(cookiesMap);
        const token = cookiesMap.get('Authorization');
        // console.log("token = " + token);
        if (token === undefined) {
            return res.status(403).json({ error: "Invalid token" });
        }
        // Verify the token
        jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
            if (error)
                return res.status(403).json({ error: "Invalid token" });
            return next();
        });
    }
    // Generate token for Authorization
    generateAuthToken(id, username) {
        return __awaiter(this, void 0, void 0, function* () {
            const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
            const accessToken = jsonwebtoken_1.default.sign({}, accessTokenSecret);
            return accessToken;
        });
    }
    /**
     *  Returns true if the password passed by the user is the same as the
     *  password stored in the database
     */
    comparePasswordHash(password, hashedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(bcrypt_1.default.compareSync(password, hashedPassword));
            return bcrypt_1.default.compareSync(password, hashedPassword);
        });
    }
    /**
     * User Login
     *
     * Check if the user credentials are not empty.
     *
     * Check the user credentials passed by the user against the one's
     * stored in the database
     *
     * If they do not match then return 'Authentication failed' status.
     *
     * If they do, then generate an access token. Set the access token
     * and user id as cookies in the client's browser.
     *
     * Return 200 with 'Authentication successful' status.
     */
    authenticateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userInfo = {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password
            };
            // Check if the user info passed is not empty
            if ((!userInfo.username || !userInfo.password)) {
                // ((!userInfo.email || !userInfo.password))) {
                return res.status(400).json({
                    status: 'Authentication falied',
                    msg: "Username and password can't be empty."
                });
            }
            let result = yield new UsersRepository_1.UsersRepository().findUser(userInfo)
                .then((userData) => __awaiter(this, void 0, void 0, function* () {
                console.log("login data = " + userData);
                // User name is matched
                if (userData !== undefined) {
                    // Compare passwords
                    if ((yield this.comparePasswordHash(userInfo.password, userData.password)) === true) {
                        // User login credentials are valid. Generate auth token
                        const accessToken = yield this.generateAuthToken(userData.userID, userData.username);
                        res.cookie('Authorization', accessToken);
                        res.cookie('id', userData.userID);
                        res.status(200).json({
                            status: 'Authentication successful',
                            msg: 'Login successful',
                            user: { id: userData.userID, username: userData.username },
                            AccessToken: accessToken
                        });
                    }
                    else {
                        res.status(403).json({
                            status: 'Authentication failed',
                            msg: 'Incorrect username or password.',
                        });
                    }
                }
                else {
                    res.status(403).json({
                        status: 'Authentication failed',
                        msg: 'Incorrect username or password.'
                    });
                }
            }))
                .catch(error => {
                res.status(500).json({
                    status: 'Authentication falied',
                    msg: 'An error has occurred while logging in. Please, try again.'
                });
            });
        });
    }
    // Checks if email is available
    checkEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const doesEmailExist = yield new UsersRepository_1.UsersRepository().checkIfEmailExists(email)
                .then((result) => __awaiter(this, void 0, void 0, function* () {
                console.log("result = ", result);
                if (result === undefined) {
                    return false;
                }
                return true;
            }))
                .catch(error => {
                return false;
            });
            return doesEmailExist;
        });
    }
    // Checks if username is available
    checkUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const doesUsernameExist = yield new UsersRepository_1.UsersRepository().
                checkIfUsernameExists(username)
                .then((result) => __awaiter(this, void 0, void 0, function* () {
                console.log("result = ", result);
                if (result === undefined) {
                    return false;
                }
                return true;
            }))
                .catch(error => {
                return false;
            });
            return doesUsernameExist;
        });
    }
    /**
     * Check if username and email address are available.
     *
     * Hash the password before saving it into the database.
     *
     * Save the user info into the users table in the database.
     *
     * Generate an access token for authorization.
     *
     * Set access token and user id as cookies in the client's browser.
     */
    registerUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userInfo = {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password
            };
            console.log(userInfo);
            if (!userInfo.username || !userInfo.email || !userInfo.password) {
                return res.status(400).json({
                    success: 'false',
                    status: 'Registration falied',
                    msg: "Username, email and password can't be empty",
                });
            }
            // Check if email is available
            let doesEmailExist = yield this.checkEmail(userInfo.email);
            if (doesEmailExist) {
                return res.status(400).json({
                    success: 'false',
                    status: 'Registration falied',
                    msg: "An account with this email address is already registered.",
                });
            }
            // Check if username is available
            let doesUsernameExist = yield this.checkUsername(userInfo.username);
            if (doesUsernameExist) {
                return res.status(400).json({
                    success: 'false',
                    status: 'Registration falied',
                    msg: "This username is not available.",
                });
            }
            // Hash password
            try {
                const salt = yield bcrypt_1.default.genSalt();
                const hashedPassword = yield bcrypt_1.default.hash(userInfo.password, salt);
                userInfo.password = hashedPassword;
            }
            catch (error) {
                return res.status(400).json({
                    success: 'false',
                    status: 'Registration failed',
                    msg: 'Failed to register user. Please, try again later.'
                });
            }
            // Add user into the users table
            new UsersRepository_1.UsersRepository().addUser(userInfo)
                .then((userData) => __awaiter(this, void 0, void 0, function* () {
                if (userData !== undefined) {
                    console.log("userID = ", userData.generatedMaps[0].userID);
                    const userID = userData.generatedMaps[0].userID;
                    const accessToken = yield this.generateAuthToken(userID, userInfo.username);
                    res.cookie('Authorization', accessToken);
                    res.cookie('id', userID);
                    return res.status(201).json({
                        success: true,
                        status: 'User is registered successfully.',
                        user: userInfo.username,
                        msg: 'User Registered.',
                        AccessToken: accessToken
                    });
                }
            }))
                .catch(error => res.status(500).json({
                sucess: 'false',
                status: 'Registration failed',
                msg: 'Failed to register user. Please, try again later.'
            }));
        });
    }
    // Sends back the user details 
    fetchUserInfo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let userID = req.params.id;
            console.log("user id = " + userID);
            new UsersRepository_1.UsersRepository().getUserById(userID)
                .then((userData) => __awaiter(this, void 0, void 0, function* () {
                console.log(userData);
                res.status(200).json(userData);
            }))
                .catch((error) => {
                console.log(error);
                res.status(400).json("Failed to fetch user info.");
            });
        });
    }
}
exports.UsersController = UsersController;
