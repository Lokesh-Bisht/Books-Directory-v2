# <p align="center">Welcome to Book Directory (RESTful API version)👋</p>

<blockquote>
Book Directory is a full stack MERN app with the following features:

* Provides user signup and sign in.
* Provides features which lets the user add, edit, remove and view books.
* Provides protected APIs that means no unauthorized user can have access to protected resources.

</blockquote>
<br/><br/>

## Table of contents

1. [Getting Started](#getting-started)
    - [The backend](#the-backend)
    - [The frontend](#the-frontend)
2. [Demo](#demo)
3. [The src folder](#the-src-folder)
4. [The database](#the-database)
5. [Installation](#installation)
6. [Configuration](#configuration)
7. [Start up](#start-up)
    - [Development mode](#development-mode)
    - [Production](#production)
    - [ES Lint](#es-lint)
8. [Launching in browser](#launching-in-browser)
9. [License](#license)
10. [Author](#author)


<br/><br/>

## Getting started

<br/>

### The backend

The app uses a Mysql database, TypeORM,and RESTful APIs in the backend. The backend is structured using MVC pattern, and uses entities and repository pattern.

Some of the backend endpoints are public and others are protected. That means no unauthorized user can have access to protected resources. This is achieved by the use of access token for authorizing client requests.

<br/>

### The frontend

The frontend is build using react and uses react router dom library for navigating between different web pages without reload. And it also usese the axios library for making client requests to the server.

<br/>

### Authorization

The app uses JWT (Json Web Token) for authoirzing the client/user requests to the server. Each client request to the server contains an access token which is used by the server to identify the user.

<br/><br/>

## Demo


<br/><br/>

## The src folder 

### Backend folder structure:

![Backend folder structure](images/backend%20folder%20structure.png)

<br/>

### Frontend folder structure:

![Frontend folder structure](images/frontend%20folder%20structure.png)

<br/><br/>

## The database

**Users table**
```sql
CREATE TABLE `Users` (
  `userID` int NOT NULL AUTO_INCREMENT,
  `username` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `password` varchar(256) NOT NULL,
  PRIMARY KEY (`userID`)
)
```
<br/>

**Books table**
```sql
CREATE TABLE `books` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(250) NOT NULL,
  `description` varchar(2000) NOT NULL,
  `coverImage` varchar(250) NOT NULL,
  `userID` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
)
```

<br/><br/>

## Installation 

1. Installing dependencies for backend

```bash
npm install
```

2. Installing dependencies for frontend

```bash
cd src/frontend
npm install
```

<br/><br/>

## Configuration (Enviroment Variables)

Add these keys as environment variable in a .env file. 

```bash
DB_HOST: loclhost or website url
DB_NAME: Database name
DB_USER: Database user
DB_PASSWORD: Database password
PORT: API server port (8080)
ACCESS_TOKEN_SECRET: Use to sign jwt tokens
```

<br/><br/>

## Start up

<br/> 

### Development mode
To start the project in development mode.

**Starting backend:**
```bash
npm run dev
```

**Starting frontend:**
```bash
cd src/frontend
npm start
```

<br/>

### Production
To start the project in production.

**Starting backend:**
```bash
npm run build   <!-- To generate the build -->
npm start
```

**Starting frontend**
```bash
cd src/frontend
npm start
```

<br/>

### ES Lint
For generating errors and warnings:

```bash
npm run lint
```

<br/><br/>

## Launching in browser

1. Frontend: http://localhost:3000/
2. Backend: http://localhost:8080/
3. Backend Swagger API docs: http://localhost:8080/api-docs

</br><br/>

## License 
Read more about the license here: <br/>
[Apache License 2.0](https://github.com/Lokesh-Bisht/Books-Directory-v2/blob/main/LICENSE)

<br/><br/>

## Author

**Lokesh Bisht**