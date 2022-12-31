import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { UsersService } from '../users/users.service'

@Injectable()
export class AuthMiddleware implements NestMiddleware {

    constructor(private usersService: UsersService) {}

    async use(req: Request, res: Response, next: NextFunction) {
        const user = await this.usersService.findOne(req.session.userId)
        if (!user) throw new UnauthorizedException('You are not authorized')
        req.user = user
        next()
    }
}