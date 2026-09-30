import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Guard that protects routes - requires valid JWT token
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
