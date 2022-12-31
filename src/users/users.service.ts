import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './user.entity'

@Injectable()
export class UsersService {    
    constructor (@InjectRepository(User) private repo: Repository<User>) {}

    async create(email: string, password: string) {
        const userExists = await this.findByEmail(email)
        if (userExists) throw new BadRequestException('Email is in use')

        const user = this.repo.create({ email, password })
        await this.repo.save(user)
        return user
    }

    findOne(id: number) {
        if (!id) return null
        return this.repo.findOneBy({ id })
    }

    findByEmail(email: string) {
        return this.repo.findOneBy({ email })
    }

    async update(id: number, attrs: Partial<User>) {
        const user = await this.findOne(id)

        if (!user) throw new NotFoundException('User not found')

        Object.assign(user, attrs)

        return this.repo.save(user)
    }

    async remove(id: number) {
        const user = await this.findOne(id)

        if (!user) throw new NotFoundException('User not found')

        return this.repo.remove(user)
    }
}
