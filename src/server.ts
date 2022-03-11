require('dotenv').config()
import express from 'express';
import "reflect-metadata";
import {createConnection} from "typeorm";
import cors from 'cors';
import { Books } from './routes/Books';
import { Users } from './routes/Users';
import bodyParser from 'body-parser';

const app = express();
const port = process.env.PORT || 3000; // INITIALIZE DEFAULT PORT OR PORT FROM ENVIRONMENT VARIABLE


createConnection().then(async connection => {

    console.log("Inserting a new user into the database...");

    app.use(bodyParser.json());
    app.use(express.json());
    app.use(express.urlencoded({extended: false}))
    
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
      }
      // some legacy browsers (IE11, various SmartTVs) choke on 204
    app.use(cors(corsOptions));

    const booksRouter = new Books();
    const usersRouter = new Users();

    app.use('/api/books', booksRouter.router);
    app.use('/api/users', usersRouter.router);
    

    app.listen(port, () => {
        console.log('Sever running on port 8080');
    });

}).catch(error => console.log(error));

