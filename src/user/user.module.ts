import {Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import {UserSchema} from "../schemas/user.schema";
import {UserService} from "./user.service";
import {MailerService} from "../mailer/mailer.service";
import {UserController} from "./user.controller";
import {RabbitModule} from "../rabbit/rabbit.service";

@Module({
    imports: [MongooseModule.forFeature([{name: 'User', schema: UserSchema}]), RabbitModule],
    controllers: [UserController],
    providers: [UserService, MailerService],
})

export class UserModule {}