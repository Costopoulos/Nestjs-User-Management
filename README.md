# Nestjs-User-Management
NestJS, MongoDB. RabbitMQ app with Typescript for managing users

## Project Description

The task is to implement an application that implements a nodeJS server API communicating with this: https://reqres.in/, using NestJS, RabbitMQ, MongoDB with Typescript.

The REST app should consist of:

1. **POST /api/users**

On the request store the user entry in db. After the creation, send an email and rabbit event. Both can be dummy sending (no consumer needed).

2. **GET /api/user/{userId}**

Retrieves data from https://reqres.in/api/users/{userId} and returns a user in JSON representation.

3. **GET /api/user/{userId}/avatar**

Retrieves image by 'avatar' URL.

On the first request it should save the image as a plain file, stored as a mongodb entry with userId and hash. Return its base64-encoded representation.

On following requests should return the previously saved file in base64-encoded. representation (retrieve from db).

4. **DELETE /api/user/{userId}/avatar**

Removes the file from the FileSystem storage.

Removes the stored entry from db.

## Design Process and Insights
First I decided to make two directories to store the mailer and notification(rabbit) services. I also created a schema
directory to store the user module. The user module contains the user controller, user service, user entity (schema), as
well as the user.module.

## Application Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## License

This project is [MIT licensed](LICENSE).
