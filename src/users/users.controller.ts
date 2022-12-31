import {
    Controller,
    Post,
    Body,
    Get,
    Patch,
    Delete,
    Param,
    Query,
    Session,
    Request
} from '@nestjs/common'
import { NotFoundException, BadRequestException } from '@nestjs/common'
import { CreateUserDto } from './dtos/create-user.dto'
import { UpdateUserDto } from './dtos/update-user.dto'
import { UsersService } from './users.service'
import { Serialize } from '../interceptors/serialize.interceptor'
import { UserDto } from './dtos/user.dto'
import { AuthService } from './auth.service'
import { Request as _Request } from 'express'

@Serialize(UserDto)
@Controller('auth')
export class UsersController {

    constructor(
        private usersService: UsersService,
        private authService: AuthService
        ) {}

    @Post('/signup')
    async createUser(@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signup(body.email, body.password)
        session.userId = user.id
        return user
    }

    @Post('/signin')
    async signin(@Request() req: _Request, @Session() session: any) {
        const user = await this.authService.signin(req.body.email, req.body.password)
        session.userId = user.id
        return user
    }

    @Get('/whoami')
    whoAmI(@Request() req: _Request, @Session() session: any) {
        return req.user
    }

    @Post('/signout')
    signOut(@Session() session: any) {
        session.userId = null
    }

    @Get('/:id')
    async findUser(@Param("id") id: string) {
        const user = await this.usersService.findOne(parseInt(id))

        if (!user) throw new NotFoundException('User not found')

        return user
    }

    @Get()
    findAllUsers(@Query('email') email: string) {
        return this.usersService.findByEmail(email)
    }

    @Delete('/:id')
    removeUser(@Param('id') id: string) {
        return this.usersService.remove(parseInt(id))
    }
    
    @Patch('/:id')
    updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
        console.log(body)
        return this.usersService.update(parseInt(id), body)
    }
}
