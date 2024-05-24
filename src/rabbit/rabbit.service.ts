import {ClientsModule, Transport} from "@nestjs/microservices";
import {Module} from "@nestjs/common";
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'RABBIT_SERVICE',
                transport: Transport.RMQ,
                options: {
                    urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
                    queue: process.env.RABBITMQ_QUEUE || 'nestjs_queue',
                    queueOptions: {
                        durable: false
                    },
                },
            },
        ]),
    ],
    exports: [ClientsModule],
})
export class RabbitModule {}