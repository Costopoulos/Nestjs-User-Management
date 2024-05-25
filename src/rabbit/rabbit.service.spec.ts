import { Test, TestingModule } from '@nestjs/testing';
import { ClientsModule, Transport, ClientProxy } from '@nestjs/microservices';
import { of } from 'rxjs';

describe('RabbitModule', () => {
  let clientProxy: ClientProxy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ClientsModule.register([
          {
            name: 'RABBIT_SERVICE',
            transport: Transport.RMQ,
            options: {
              urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
              queue: process.env.RABBITMQ_QUEUE || 'nestjs_queue',
              queueOptions: { durable: false },
            },
          },
        ]),
      ],
    }).compile();

    clientProxy = module.get<ClientProxy>('RABBIT_SERVICE');
  });

  it('should be defined', () => {
    expect(clientProxy).toBeDefined();
  });

  it('should emit a message to the queue', async () => {
    const emitSpy = jest
      .spyOn(clientProxy, 'emit')
      .mockImplementation(() => of(true));

    clientProxy.emit('test.message', { payload: 'test' });
    expect(emitSpy).toHaveBeenCalledWith('test.message', { payload: 'test' });
  });
});
