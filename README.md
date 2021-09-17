## NestJS-assignment -- Social Network

This project was bootstrapped with [nestjs](https://nestjs.com/).

## About this project

- This project is for practice only
- The idea is to get comfortable with the nestJS framework, to realize the importance of typescript on server side and to understand the ins and outs of scalable and maintainable server side architecture.
- On the frontend a user can login to view a very crude live feed of the posts of the users that they follow. However, the entire REST api has been configured and can be used as well.
- A user can sign up, login, view feed, follow/unfollow other users
- A user can create and view posts

## Requirements

- [Nest Js v8](https://docs.nestjs.com/first-steps)
- [MongoDb v5](https://www.mongodb.com/try/download/community)

## SDK's Used in this project

- [Mongoose](https://mongoosejs.com)

## Installation Instructions

- Globally install nodejs
  --in order to enable you machine to run javascript

```bash
sudo apt install nodejs
```

- Globally install mongodb (https://docs.mongodb.com/manual/installation/)
  --Inorder to work with a NOSQL database

- Install nestjs CLI
  --in order to utilise nest framework

```bash
npm i -g @nestjs/cli
```

## Setup Instructions

Clone the repo and install the dependencies.

```bash
npm install
```

```bash
Create .env file in the project root
```

```bash
Add these credentials in .env file
PORT=3000
mongoURL = "mongodb://localhost/nest"
JWT_SECRET = "plswork"

```

## Running on local

To start the server, run the following

```bash
npm run start
```

## Documentation

See the collection for documentation:

- navigate to localhost:3000/api in your browser after running run command

## Architecture Diagram

![Screenshot](docs/images/Architectural diagram.png)

## Database Design

![Screenshot](docs/images/database-diagram.png)
