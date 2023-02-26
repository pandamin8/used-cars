import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service'
import { AuthService } from './auth.service'
import { User } from './user.entity'

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>
  let fakeAuthService: Partial<AuthService>

    beforeEach(async () => {
      fakeUsersService = {
        findOne: (id: number) => Promise.resolve({ id, email: 'test@test.com', password: 'password' } as User),
        findByEmail: (email) => Promise.resolve({ id: 1, email, password: 'password' } as User),
        // remove: () => ,
        // update: () => {}
      }
      fakeAuthService = {
        // signup: () => {},
        signin: (email: string, password: string) => Promise.resolve({ id: 1, email, password } as User)
      }
  
      const module: TestingModule = await Test.createTestingModule({
        controllers: [UsersController],
        providers: [
          {
            provide: AuthService,
            useValue: fakeAuthService
          },
          {
            provide: UsersService,
            useValue: fakeUsersService
          }
        ]
      }).compile();
  
      controller = module.get<UsersController>(UsersController);
    })

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('finds the user with the given id', async () => {
    const user = await controller.findUser('1')    
    expect(user.id).toBe(1)
  })

  it('throws a 404 error if the user with the given id does not exist', (done) => {
    fakeUsersService.findOne = () => Promise.resolve(null)
    controller.findUser('1').catch(() => done())
  })

  it('signs in, updates session object, and returns user', async () => {
    const session = { userId: -20 }
    const user = await controller.signin(
      { email: 'test@test.com', password: 'password' },
      session
    )
    
    expect(user.id).toEqual(1)
    expect(session.userId).toEqual(1)
  })
});
