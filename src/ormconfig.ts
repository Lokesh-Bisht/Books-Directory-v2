import { ConnectionOptions } from "typeorm";
require('dotenv').config()

const dbOptions: ConnectionOptions = {
   "type": "mysql",
   "host": process.env.DB_HOST,
   "port": 3306,
   "username": process.env.DB_USER,
   "password": process.env.DB_PASSWORD ,
   "database": process.env.DB_NAME,
   "synchronize": false,
   "logging": false,
   "entities": [
      "src/entity/**/*.ts"
   ],
   "migrations": [
      "src/migration/**/*.ts"
   ],
   "subscribers": [
      "src/subscriber/**/*.ts"
   ],
   "cli": {
      "entitiesDir": "src/entity",
      "migrationsDir": "src/migration",
      "subscribersDir": "src/subscriber"
   }
};

module.exports = dbOptions;