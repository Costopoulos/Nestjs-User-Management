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
First I decided to make a directory for the mailer service (`src/mailer`), while I had already defined the MongoDB 
connection and the RabbitMQ service in the `app.module.ts` file. 
I then created a `src/user` directory to store everything related to the user, except from their schema, which is 
defined in a schema directory under `src`, aka `src/schemas`. The user module contains the user controller, user service,
as well as the user.module. Normally, it is a good practice to keep all the schemas in a separate directory, and,
although technically not needed for this sole-entity-project, I decided to keep it that way for the sake of consistency.

I decided to separate RabbitMQ as a separate service, as it is a good practice to keep the services separate from the
controllers and the business logic, especially when keeping in mind that we want anything to be added without a problem
and the code can scale infinitely. Therefore, I created a `src/rabbit` directory to store the RabbitMQ service and the
RabbitMQ module.

Developing the API, the second endpoint, `GET /api/user/{userId}`, refers to a `userId` that is not the same as the one
in the MongoDB database, thus is not alphanumeric, but rather, a number. That is why I kept this as a number, in order
to keep the API consistent with the `Reqres` API. On the other hand, the `userId` for the other two endpoints containing
a `userId` is the one from the MongoDB database, thus is alphanumeric. There was no need changing it to be an incremental
numerical, as it is not needed for the purpose of the endpoints and would only further complicate the code.

For the POST request I decided to add a `USE_DUMMY_EMAIL` environment variable, which, if set to `true`, will send a
dummy email to the user created. It is essentially logging to the console the hard-coded sender, aka me - 
costopoulos.constantinos@gmail.com, the email of the user, the subject and the contents of the email through which the
user is welcomed to my platform. The email is sent using the `nodemailer` package, and the email is sent to the user's
email address, which is stored in the MongoDB database. In the future, I will implement that if the env variable is set
to `false`, the email will be _actually_ sent from my email address to the user's email address, with the same content
as the dummy email. The implementation will be based on 2-step verification through Gmail and the `OAuth2` protocol, so
an application-specific password will be used in order for my email data to be safe.

For getting the avatar of the user given their id, I check if the avatar element acquired when querying the database is 
a url, it is the first call for this user, so save the image to the file system after having hashed it with the `MD5`
algorithm. The MD5 algorithm is used to hash the image, as it is a fast and reliable algorithm for hashing files. The
image is then saved in the `media/avatars` directory, with the name of the file being the hash of the image. The hash
is then stored in the MongoDB database, along with the user's id. The image is then returned in `base64` encoding. If the
avatar element is not a url, then the image is already saved in the file system, so the image is read from the file system.

To verify that the image is encoded to base64 correctly, I created a `image.b64` file under a the `media/avatars/encoding-decoding-test`
directory to store the base64 encoded image - the string essentially - and then I `base64 -d image.b64 > image.jpg` to
decode the image and see if it is the same as the original image. It is the same, so the encoding is correct.


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
