import express from 'express';
import { UsersController } from '../controller/UsersController';

export class Users {

  public router = express.Router();
  private usersController = new UsersController();
  
  constructor() {

    // Sign up
    this.router.post('/register', (req, res) => 
    this.usersController.registerUser(req, res));


    // Log in 
    this.router.post('/login', (req, res) => 
    this.usersController.authenticateUser(req, res));
  

    // After successfull log in redirect the user to his/her profile
    this.router.get('/:id', (req, res, next) => {
      this.usersController.authenticateToken(req, res, next);
    }, (req, res) => {
      this.usersController.fetchUserInfo(req, res);
    });
  }
}