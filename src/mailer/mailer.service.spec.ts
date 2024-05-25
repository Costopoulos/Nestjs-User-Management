import { Test, TestingModule } from '@nestjs/testing';
import { MailerService } from './mailer.service';
import * as nodemailer from 'nodemailer';

jest.mock('nodemailer');

describe('MailerService', () => {
  let service: MailerService;

  const mockTransport = {
    sendMail: jest.fn(),
  };

  beforeEach(async () => {
    (nodemailer.createTransport as jest.Mock).mockReturnValue(mockTransport);

    const module: TestingModule = await Test.createTestingModule({
      providers: [MailerService],
    }).compile();

    service = module.get<MailerService>(MailerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendMail with real email configuration', () => {
    beforeEach(() => {
      process.env.USE_DUMMY_EMAIL = 'false';
      process.env.SMTP_HOST = 'smtp.example.com';
      process.env.SMTP_PORT = '587';
      process.env.SMTP_USER = 'user@example.com';
      process.env.SMTP_PASS = 'password';
    });

    it('should send an email', async () => {
      const emailDetails = {
        to: 'test@example.com',
        subject: 'Test Subject',
        text: 'Test Text',
      };

      await service.sendMail(
        emailDetails.to,
        emailDetails.subject,
        emailDetails.text,
      );

      expect(mockTransport.sendMail).toHaveBeenCalledWith({
        from: '"NestJS User Management" <costopoulos.constantinos@gmail.com>',
        to: emailDetails.to,
        subject: emailDetails.subject,
        text: emailDetails.text,
      });
    });
  });

  describe('sendMail with dummy email configuration', () => {
    beforeEach(() => {
      process.env.USE_DUMMY_EMAIL = 'true';
    });

    it('should log dummy email content', async () => {
      console.log = jest.fn();

      const emailDetails = {
        to: 'test@example.com',
        subject: 'Test Subject',
        text: 'Test Text',
      };

      await service.sendMail(
        emailDetails.to,
        emailDetails.subject,
        emailDetails.text,
      );

      expect(console.log).toHaveBeenCalledWith('Dummy email content:');
      expect(console.log).toHaveBeenCalledWith(
        `From: "NestJS User Management" <costopoulos.constantinos@gmail.com>`,
      );
      expect(console.log).toHaveBeenCalledWith(`To: ${emailDetails.to}`);
      expect(console.log).toHaveBeenCalledWith(
        `Subject: ${emailDetails.subject}`,
      );
      expect(console.log).toHaveBeenCalledWith(`Text: ${emailDetails.text}`);
    });
  });
});
