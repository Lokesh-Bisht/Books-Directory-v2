import { Request, Response, NextFunction } from 'express';
import Jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { UsersRepository } from '../Repository/UsersRepository';
dotenv.config();


export interface UserInfo {
  username: string,
  email: string,
  password: string
} 


// Object to store response returned by the database.
interface UserInfoResponse {
  id: number,
  username: string,
}


/**
 * A class for processing user requests like user registration, login, 
 * user validation and fetching user info. 
 */
export class UsersController {


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
  authenticateToken(req: Request, res: Response, next: NextFunction) {

    const authHeader = req.headers.cookie;

    // console.log(authHeader);

    if (authHeader === undefined) {
      return res.status(403).json({ error: "User is not logged in." })
    }

    const cookies: string[] = authHeader?.split(';')
    const cookiesMap: Map<string, string> = new Map();
    cookies.forEach(cookie => {
      const keyValue = cookie.split('=');

      // .replace(/ /g, '');  => to remove spaces from the string
      cookiesMap.set(keyValue[0].replace(/ /g,''), keyValue[1]);
    });

    // console.log(cookiesMap);

    const token: string | undefined = cookiesMap.get('Authorization');
    // console.log("token = " + token);

    if (token === undefined) {
      return res.status(403).json({ error: "Invalid token" });
    }

    // Verify the token
    Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, 
      (error:any, user:any) => {
        if (error) return res.status(403).json({ error: "Invalid token" });
        return next();
      })
  }


  // Generate token for Authorization
  private async generateAuthToken(id: number, username: string) {
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET as string;
    const accessToken = Jwt.sign({}, accessTokenSecret);
    return accessToken;
  }



  /**
   *  Returns true if the password passed by the user is the same as the
   *  password stored in the database
   */
  private async comparePasswordHash(password: string, hashedPassword: string) {
    console.log(bcrypt.compareSync(password, hashedPassword));
    return bcrypt.compareSync(password, hashedPassword);
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
  async authenticateUser(req: Request, res: Response) {

    const userInfo: UserInfo = { 
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
      })
    }


    let result = await new UsersRepository().findUser(userInfo)
    .then( async (userData: any) => {
      console.log("login data = " + userData);
      
      // User name is matched
      if (userData !== undefined) {

        // Compare passwords
        if (await this.comparePasswordHash(userInfo.password, 
          userData.password) === true) {

          // User login credentials are valid. Generate auth token
          const accessToken = await this.generateAuthToken(userData.userID, 
            userData.username);
            
           
          res.cookie('Authorization', accessToken);
          res.cookie('id', userData.userID);

          res.status(200).json({ 
            status: 'Authentication successful',
            msg: 'Login successful',
            user: {id: userData.userID, username: userData.username}, 
            AccessToken: accessToken
          });
        
        } else {
          res.status(403).json({ 
            status: 'Authentication failed',
            msg: 'Incorrect username or password.', 
          });
        }
      } else {
        res.status(403).json({ 
          status: 'Authentication failed',
          msg: 'Incorrect username or password.'
         })
      }
    })
    .catch( error => {
      res.status(500).json({ 
        status: 'Authentication falied', 
        msg: 'An error has occurred while logging in. Please, try again.'
      })
    });

  }


  // Checks if email is available
  private async checkEmail(email: string) : Promise<boolean> {
    const doesEmailExist = await new UsersRepository().checkIfEmailExists(email)
    .then(async (result: any) => {
      console.log("result = ",result);
      if (result === undefined) {
        return false;
      }
      return true;
    })
    .catch(error => {
      return false;
    });

    return doesEmailExist;
  }


  // Checks if username is available
  private async checkUsername(username: string) : Promise<boolean> {
    const doesUsernameExist = await new UsersRepository().
    checkIfUsernameExists(username)
    .then(async (result: any) => {
      console.log("result = ",result);
      if (result === undefined) {
        return false;
      }
      return true;
    })
    .catch(error => {
      return false;
    });

    return doesUsernameExist;
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
  async registerUser(req: Request, res: Response) {
    const userInfo: UserInfo = { 
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
    let doesEmailExist: boolean = await this.checkEmail(userInfo.email);

    if (doesEmailExist) {
      return res.status(400).json({
        success: 'false',
        status: 'Registration falied', 
        msg: "An account with this email address is already registered.",
      });
    }

    // Check if username is available
    let doesUsernameExist: boolean = await this.checkUsername(userInfo.username);

    if (doesUsernameExist) {
      return res.status(400).json({
        success: 'false',
        status: 'Registration falied', 
        msg: "This username is not available.",
      });
    }


    // Hash password
    try {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(userInfo.password, salt);
      userInfo.password = hashedPassword;
    } catch(error) {
      return res.status(400).json({
        success: 'false',
        status: 'Registration failed',
        msg: 'Failed to register user. Please, try again later.'
      });
    }
    
    // Add user into the users table
    new UsersRepository().addUser(userInfo)
    .then(async (userData: any) => {

      if (userData !== undefined) {

        console.log("userID = ", userData.generatedMaps[0].userID);
        const userID = userData.generatedMaps[0].userID;
        
        const accessToken = await this.generateAuthToken(userID, 
          userInfo.username);

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
    })
    .catch(error => res.status(500).json({ 
      sucess: 'false',
      status: 'Registration failed',
      msg: 'Failed to register user. Please, try again later.' 
    }));

  }


  // Sends back the user details 
  async fetchUserInfo(req: Request, res: Response) {
    let userID: string = req.params.id; 
    console.log("user id = " + userID);

    new UsersRepository().getUserById(userID)
    .then(async(userData: any) => {
      console.log(userData);
      res.status(200).json(userData);
    })
    .catch((error: any) => {
      console.log(error);
      res.status(400).json("Failed to fetch user info.");
    })
  }
}