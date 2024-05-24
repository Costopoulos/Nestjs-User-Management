import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from "@nestjs/mongoose";
import {ClientsModule, Transport} from "@nestjs/microservices";
import {MailerService} from "./mailer/mailer.service";
import * as process from "node:process";

@Module({
    imports: [
        MongooseModule.forRoot(process.env.MONGO_URL || 'mongodb://localhost/nestjs-user-management'),
        ClientsModule.register([
            {
                name: 'RABBIT_SERVICE',
                transport: Transport.RMQ,
                options: {
                    urls: [process.env.RABBIT_URL || 'amqp://localhost:5672'],
                    queue: process.env.RABBIT_QUEUE || 'nestjs_queue',
                    queueOptions: {
                        durable: false
                    },
                },
            },
        ]),
    ],
    controllers: [AppController],
    providers: [AppService, MailerService],
})

export class AppModule {}
