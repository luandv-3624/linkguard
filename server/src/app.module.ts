import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { join } from 'path';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import configuration from './config/configuration';
import { UrlAnalysisModule } from './modules/url-analysis/url-analysis.module';
import { AuthModule } from './modules/auth/auth.module';
import { ThreatIntelligenceModule } from './modules/threat-intelligence/threat-intelligence.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KeepAliveService } from './keep-alive.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [join(process.cwd(), 'server/.env')],
      load: [configuration],
    }),

    ScheduleModule.forRoot(),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('database.synchronize'),
        logging: configService.get('database.logging'),
        autoLoadEntities: true,
      }),
    }),

    // Redis Cache
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const redisHost = configService.get('redis.host');
        const redisPort = configService.get('redis.port');
        const cacheTtl = configService.get('cache.ttl');

        // If Redis not available, use memory cache
        if (!redisHost) {
          return {
            ttl: cacheTtl,
            max: 100,
          };
        }

        try {
          return {
            store: await redisStore({
              socket: {
                host: redisHost,
                port: redisPort,
              },
              ttl: cacheTtl * 1000, // milliseconds
            }),
            ttl: cacheTtl,
            max: 100,
          };
        } catch (error: Error | unknown) {
          Logger.warn(`Redis connection error: ${(error as Error).message}`);
          console.warn('Redis connection failed, using memory cache');
          return {
            ttl: cacheTtl,
            max: 100,
          };
        }
      },
    }),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 10,
      },
      {
        name: 'medium',
        ttl: 60000,
        limit: 100,
      },
      {
        name: 'long',
        ttl: 3600000,
        limit: 1000,
      },
    ]),

    AuthModule,
    UrlAnalysisModule,
    ThreatIntelligenceModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    AppService,
    KeepAliveService,
  ],
})
export class AppModule {}
