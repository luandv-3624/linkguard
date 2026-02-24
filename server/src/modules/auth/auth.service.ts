import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(RefreshToken)
    private refreshTokenRepo: Repository<RefreshToken>,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto, ipAddress?: string, userAgent?: string) {
    const user = await this.userRepo.findOne({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const match = await bcrypt.compare(dto.password, user.passwordHash);

    if (!match) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last login
    user.lastLoginAt = new Date();
    await this.userRepo.save(user);

    // Generate tokens
    const { accessToken, refreshToken } = await this.generateTokens(
      user,
      ipAddress,
      userAgent,
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    };
  }

  async generateTokens(user: User, ipAddress?: string, userAgent?: string) {
    // Generate short-lived access token (15 minutes)
    const accessToken = this.jwtService.sign(
      {
        sub: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      {
        expiresIn: '1m', // set 1 minute for testing, change to 1m in production
      },
    );

    // Generate long-lived refresh token (7 days)
    const refreshTokenValue = crypto.randomBytes(64).toString('hex');

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    // Save refresh token to database
    const refreshToken = this.refreshTokenRepo.create({
      token: refreshTokenValue,
      userId: user.id,
      expiresAt,
      ipAddress,
      userAgent,
    });

    await this.refreshTokenRepo.save(refreshToken);

    // Clean up old expired tokens for this user
    await this.cleanupExpiredTokens(user.id);

    return {
      accessToken,
      refreshToken: refreshTokenValue,
    };
  }

  async refreshAccessToken(refreshTokenValue: string) {
    // Find refresh token
    const refreshToken = await this.refreshTokenRepo.findOne({
      where: { token: refreshTokenValue },
      relations: ['user'],
    });

    if (!refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Check if revoked
    if (refreshToken.isRevoked) {
      throw new UnauthorizedException('Refresh token has been revoked');
    }

    // Check if expired
    if (new Date() > refreshToken.expiresAt) {
      throw new UnauthorizedException('Refresh token expired');
    }

    // Generate new access token
    const accessToken = this.jwtService.sign(
      {
        sub: refreshToken.user.id,
        email: refreshToken.user.email,
        isAdmin: refreshToken.user.isAdmin,
      },
      {
        expiresIn: '1m',
      },
    );

    return {
      accessToken,
      user: {
        id: refreshToken.user.id,
        email: refreshToken.user.email,
        isAdmin: refreshToken.user.isAdmin,
      },
    };
  }

  async revokeRefreshToken(refreshTokenValue: string) {
    const refreshToken = await this.refreshTokenRepo.findOne({
      where: { token: refreshTokenValue },
    });

    if (refreshToken) {
      refreshToken.isRevoked = true;
      refreshToken.revokedAt = new Date();
      await this.refreshTokenRepo.save(refreshToken);
    }
  }

  async revokeAllUserTokens(userId: string) {
    await this.refreshTokenRepo.update(
      { userId, isRevoked: false },
      { isRevoked: true, revokedAt: new Date() },
    );
  }

  async cleanupExpiredTokens(userId: string) {
    // Delete expired and revoked tokens
    await this.refreshTokenRepo.delete({
      userId,
      expiresAt: LessThan(new Date()),
    });

    await this.refreshTokenRepo.delete({
      userId,
      isRevoked: true,
    });
  }

  async validateUserById(userId: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { id: userId } });
  }

  async getProfile(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
    };
  }
}
