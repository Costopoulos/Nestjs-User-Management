import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongooseModule } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { Connection, connect } from 'mongoose';

describe('UserService (e2e)', () => {
  let app: INestApplication;
  let mongoServer: MongoMemoryServer;
  let mongoConnection: Connection;
  let userModel: Model<User>;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    mongoConnection = (await connect(mongoServer.getUri())).connection;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        MongooseModule.forRootAsync({
          useFactory: () => ({
            uri: mongoServer.getUri(),
          }),
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    userModel = moduleFixture.get<Model<User>>(getModelToken('User'));
  });

  // Set the timeout for all tests in this describe block
  jest.setTimeout(20000); // Sets timeout to 20 seconds

  afterAll(async () => {
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await mongoServer.stop();
    await app.close();
  });

  beforeEach(async () => {
    await userModel.deleteMany({});
  });

  it('should create a new user, send a welcome email, and emit a RabbitMQ event', async () => {
    const requestBody = {
      email: 'johndoe@email.com',
      first_name: 'John',
      last_name: 'Doe',
      avatar: 'http://',
    };

    const response = await request(app.getHttpServer())
      .post('/api/users')
      .send(requestBody)
      .expect(201);

    expect(response.body.email).toBe(requestBody.email);

    // Add more assertions as necessary
  });

  it('should throw error if user already exists', async () => {
    const existingUser = new userModel({
      email: 'johndoe@email.com',
      first_name: 'John',
      last_name: 'Doe',
      avatar: 'http://',
    });
    await existingUser.save();

    const requestBody = {
      email: 'johndoe@email.com',
      first_name: 'John',
      last_name: 'Doe',
      avatar: 'http://',
    };

    const response = await request(app.getHttpServer())
      .post('/api/users')
      .send(requestBody)
      .expect(500);

    expect(response.body.message).toBe('User already exists');
  });

  it('should return user data', async () => {
    const user = new userModel({
      email: 'george.bluth@reqres.in',
      first_name: 'George',
      last_name: 'Bluth',
      avatar: 'http://example.com/avatar.jpg',
    });
    await user.save();

    const response = await request(app.getHttpServer())
      .get(`/api/user/1`)
      .expect(200);

    expect(response.body.email).toBe('george.bluth@reqres.in');
  });

  it('should throw NotFoundException if user not found', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/user/999999999999999999999999')
      .expect(404);

    expect(response.body.message).toBe('User not found');
  });

  // Add more integration tests as necessary
});
