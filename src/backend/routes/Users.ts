import express from "express";
import { UsersController } from "../controller/UsersController";

export class Users {
  public router = express.Router();
  private usersController = new UsersController();

  constructor() {
    /**
     * @swagger
     * tags:
     *  name: Users
     *  description: The users managing API
     */

    /**
     * @swagger
     * /api/users/register:
     *  post:
     *    summary: Registers a new user into the database and sets an authentication 
     *             token in the user's browser on successful registration.
     *    tags: [Users]
     *    requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            $ref: '#/components/schemas/RegisterUser'
     *    consumes: 
     *      - application/json
     *    produces: 
     *      - application/json
     *    responses:
     *      200:
     *        description: User is registered successfully
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/RegisterUserResponse'
     *      400:
     *        description: Failed to register user
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/RegisterUserErrorResponse400'
     *      500:
     *        description: Internal server error
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/RegisterUserErrorResponse500'
     */
    this.router.post("/register", (req, res) =>
      this.usersController.registerUser(req, res)
    );


    /**
     * @swagger
     * /api/users/login:
     *  post:
     *    summary: Sets an authentication token in the user's browser on successful user login.
     *    tags: [Users]
     *    requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            $ref: '#/components/schemas/Login'
     *    consumes: 
     *      - application/json
     *    produces: 
     *      - application/json
     *    responses: 
     *      200:
     *        description: Login success
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/LoginResponse'
     *      403:
     *        description: User login failure
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/LoginErrorResponse403'
     *      500:
     *        description: Internal server error
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/LoginErrorResponse500'
     */
    // Log in
    this.router.post("/login", (req, res) =>
      this.usersController.authenticateUser(req, res)
    );

    /**
     * @swagger
     * /api/users/:id:
     *  get:
     *    summary: Returns the user info if the user is logged in.
     *    tags: [Users]
     *    security: 
     *      - bearerAuth: []
     *    consumes: 
     *      - application/json
     *    produces: 
     *      - application/json
     *    parameters:
     *      - in: path
     *        name: id
     *        description: User ID
     *        schema: 
     *          type: string  
     *        required: true
     *    responses: 
     *      200:
     *        description: Successful in fetching
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/GetUserResponse'
     *      401:
     *        description: Invalid user or user is not logged in (Unauthorized user).
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/UnauthorizedAccess'       
     *      500:
     *        description: Internal server error
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/GetUserErrorResponse500'
     */
    // After successfull log in redirect the user to his/her profile
    this.router.get(
      "/:id",
      this.usersController.authenticateToken,
      this.usersController.fetchUserInfo
    );
  }
}
