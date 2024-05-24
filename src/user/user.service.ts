import {Inject, Injectable, NotFoundException} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {User} from "../schemas/user.schema";
import {MailerService} from "../mailer/mailer.service";
import {ClientProxy} from "@nestjs/microservices";
import {deleteFile, hashAndSave} from "../utils/file-utils";
import axios from "axios";
import * as path from 'path';
import * as fs from "node:fs";

@Injectable()
export class UserService {
    constructor(
        @InjectModel('User') private readonly userModel: Model<User>,
        private readonly mailerService: MailerService,
        @Inject('RABBIT_SERVICE') private readonly client: ClientProxy,
    ) {
    }

    async createUser(email: string, first_name: string, last_name: string, avatar: string): Promise<User> {
        const newUser = new this.userModel({email, first_name, last_name, avatar});
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

    // This id is of type string, since it is referring to the id of the user in the database, not in the URL
    async getAvatarById(id: string): Promise<string> {
        // Retrieve the avatar element of the user with the given id from the mongo database
        const user = await this.userModel.findOne({_id: id});
        if (!user) {
            throw new NotFoundException('User not found');
        }
        let avatar = user.avatar;

        // If the avatar is a url, it is the first call for this user, so save the image to the file system after
        // having md5 hashed it
        if (avatar.startsWith('http')) {
            avatar = await hashAndSave(avatar);

            // Update the user document in MongoDB with the new avatar
            await this.userModel.findByIdAndUpdate(id, {avatar: avatar});
        }

        // If the avatar is not a url, it is the second call for this user, so retrieve the image from the file system
        // straight away
        const avatarPath = path.join(__dirname, '../../media/avatars', `${avatar}.jpg`);
        const avatarBuffer = fs.readFileSync(avatarPath);
        return Buffer.from(avatarBuffer).toString('base64');
    }


    // Since the avatar element is essentially a url to an image,
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