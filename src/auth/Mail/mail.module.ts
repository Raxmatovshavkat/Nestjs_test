import { Module } from '@nestjs/common';
import { EmailService } from './mail.service';

@Module({
    providers: [EmailService],
    exports: [EmailService], 
})
export class MailModule { }
