import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const configService = app.get(ConfigService);

  const dataSource = app.get(DataSource);

  const userRepo = dataSource.getRepository('User');

  const email = configService.get<string>('ADMIN_EMAIL') as string;
  const password = configService.get<string>('ADMIN_PASSWORD') as string;

  const existed = await userRepo.findOne({ where: { email } });

  if (existed) {
    console.log('⚠️ Admin already exists');
    process.exit(0);
  }

  const hash = await bcrypt.hash(password, 10);

  await userRepo.save({
    email,
    passwordHash: hash,
    isAdmin: true,
  });

  console.log('✅ Admin created successfully');
  process.exit(0);
}

bootstrap();
