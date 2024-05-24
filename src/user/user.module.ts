import {Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import {UserSchema} from "../schemas/user.schema";
import {UserService} from "./user.service";
import {MailerService} from "../mailer/mailer.service";
import {UserController} from "./user.controller";

@Module({
    imports: [MongooseModule.forFeature([{name: 'User', schema: UserSchema}])],
    controllers: [UserController],
    providers: [UserService, MailerService],
})

export class UserModule {}