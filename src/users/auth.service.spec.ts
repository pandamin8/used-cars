import { Test } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { UsersService } from './users.service'
import { User } from './user.entity'

describe('AuthService', () => {
    let service: AuthService
    let fakeUsersService: Partial<UsersService>

    beforeEach(async () => {

        const users: User[] = []

        fakeUsersService = {
            findByEmail: (email: string) => {
                let user: User

                users.forEach((u) => {
                    if (email === u.email) {
                        user = u
                        return
                    }
                })

                return Promise.resolve(user)
            },
            create: (email: string, password: string) => {
                const user = { id: new Date().getTime(), email: email, password: password } as User
                users.push(user)
                return Promise.resolve(user)
            }
        }
    
        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: fakeUsersService
                }
            ]
        }).compile()
    
        service = module.get(AuthService)
    })
    
    
    it('can create an instance of auth service', async () => {
        
        expect(service).toBeDefined()
    })

    it('creates a new user with a salted and hashed password', async () => {
        const user = await service.signup('user@test.com', 'test')

        expect(user.password).not.toEqual('asdf')
        const [salt, hash] = user.password.split('.')
        expect(salt).toBeDefined()
        expect(hash).toBeDefined()
    })

    it('throws an error if user signs up with email that is in use', (done) => {

        service.signup('email@inuse.com', 'password')
        .then(() => service.signup('email@inuse.com', 'password'))
        .catch(() => done())

    })

    it('throws an error if an invalid password is provided', (done) => {
        service.signup('test@test.com', 'password')
        .then(() => service.signin('test@test.com', 'not-password'))
        .catch(() => done())
    })

    it('returns a user if correct password is provided', async () => {
        await service.signup('test@test.com', 'abcdefg')
        const user = await service.signin('test@test.com', 'abcdefg')
        expect(user).toBeDefined()
    })
})
