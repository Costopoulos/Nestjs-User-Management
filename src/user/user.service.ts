import {Inject, Injectable, NotFoundException} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {User} from "../schemas/user.schema";
import {MailerService} from "../mailer/mailer.service";
import {ClientProxy} from "@nestjs/microservices";
import {deleteFile} from "../utils/file-utils";
import * as path from 'path';
import axios from "axios";
import * as fs from "node:fs";

@Injectable()
export class UserService {
    constructor(
        @InjectModel('User') private readonly userModel: Model<User>,
        private readonly mailerService: MailerService,
        @Inject('RABBIT_SERVICE') private readonly client: ClientProxy,
    ) {
    }

    async createUser(email: string, firstName: string, lastName: string, avatar: string): Promise<User> {
        const newUser = new this.userModel({email, firstName, lastName, avatar});
        const savedUser = await newUser.save();

        // Send email
        await this.mailerService.sendMail(
            email,
            'Welcome to NestJS User Management',
            `Hello ${email}, welcome to our platform!`
        );

        // Emit RabbitMQ event
        this.client.emit('user_created', savedUser);

        return savedUser;
    }

    async getUserById(id: number): Promise<User> {
        // Get data by doing a GET request to `https://reqres.in/api/users/${id}`
        try {
            const response = await axios.get(`https://reqres.in/api/users/${id}`);
            return response.data.data; // Return the user data
        } catch (error) {
            throw new NotFoundException('User not found');
        }
    }

    // async getAvatarById(id: number): Promise<string> {
    //     const user = await this.userModel.findById(id).exec();
    //     if (!user) {
    //         throw new NotFoundException('User not found');
    //     }
    //
    //     // if it's not the first call, aka the avatar already exists in the file system
    //     if (user.avatar) {
    //         const filePath = path.join(__dirname, '../../media/avatars', user.avatar);
    //         const fileBuffer = fs.readFileSync(filePath);
    //         return fileBuffer.toString('base64');
    //     }
    //
    //     try {
    //
    //     }
    //
    //
    // }
    //
    // async deleteUserAvatar(id: number): Promise<void> {
    //     const user = await this.getUserById(id);
    //     if (!user.avatar) {
    //         throw new NotFoundException('Avatar not found');
    //     }
    //
    //     // Define the file path (assuming avatars are stored in a specific directory)
    //     const filePath = path.join(__dirname, '../../uploads/avatars', user.avatar);
    //
    //     // Delete the avatar file
    //     try {
    //         await deleteFile(filePath);
    //     } catch (error) {
    //         throw new Error(`Error deleting avatar file: ${error.message}`);
    //     }
    //
    //     // Remove the avatar reference from the user document in MongoDB
    //     user.avatar = null;
    //     await user.save();
    // }
}