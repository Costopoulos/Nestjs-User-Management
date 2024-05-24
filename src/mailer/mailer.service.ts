import {Injectable} from "@nestjs/common";
import * as nodemailer from "nodemailer";
import * as process from "node:process";

@Injectable()
export class MailerService {
    private transporter = nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT || 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }

    async sendMail(to: string, subject: string, text: string): Promise<void> {
        const mailOptions = {
            from: '"NestJS User Management" <costopoulos.constantinos@gmail.com>', // sender address
            to: to, // list of receivers
            subject: subject, // Subject line
            text: text, // plain text body
        };

        await this.transporter.sendMail(mailOptions);
    }
}