import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const accessTokenSecret = process.env.DATABASE_ACCESS_TOKEN_SECRET;
        const request = context.switchToHttp().getRequest<Request>();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException('Token not found');
        }

        try {
            
            const payload = await this.jwtService.verifyAsync(token, {
                secret: accessTokenSecret,
                
                
            });

            request['user'] = payload;
            console.log('Payload:', payload);
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                throw new UnauthorizedException('Token has expired');
            }
            throw new UnauthorizedException('Invalid token');
        }

        return true;
    }

    private extractTokenFromHeader(request: Request): string | null {
        const authHeader = request.headers.authorization;
        if (!authHeader) {
            return null;
        }
        const [bearer, token] = authHeader.split(' ');
        return bearer === 'Bearer' ? token : null;
    }
}
