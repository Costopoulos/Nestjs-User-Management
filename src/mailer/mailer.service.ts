import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as process from 'node:process';

@Injectable()
export class MailerService {
  private transporter = nodemailer.Transporter;

  constructor() {
    if (process.env.USE_DUMMY_EMAIL === 'true') {
      this.transporter = nodemailer.createTransport({
        streamTransport: true,
        newline: 'unix',
        buffer: true,
      });
    } else {
      this.transporter = nodemailer.createTransport({
        // Since in the scope of this project only a dummy email is gonna be
        // sent, I am using the Mailtrap SMTP server
        host: process.env.SMTP_HOST || 'sandbox.smtp.mailtrap.io',
        port: process.env.SMTP_PORT || 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER || '48f7e42476e96e',
          pass: process.env.SMTP_PASS || 'cfc7a862667437',
        },
      });
    }
  }

  async sendMail(to: string, subject: string, text: string): Promise<void> {
    const mailOptions = {
      from: '"NestJS User Management" <costopoulos.constantinos@gmail.com>', // sender address
      to: to || 'dkns99@gmail.com', // list of receivers or dummy email
      subject: subject, // Subject line
      text: text, // plain text body
    };

    if (process.env.USE_DUMMY_EMAIL === 'true') {
      console.log('Dummy email content:');
      console.log(`From: ${mailOptions.from}`);
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Text: ${text}`);
    }

    await this.transporter.sendMail(mailOptions);
  }
}
