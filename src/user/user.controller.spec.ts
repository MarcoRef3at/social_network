import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUserService = {
    createUser: jest.fn(),
    followUser: jest.fn(),
    addFriend: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockUserService }],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createUserDto = { fullName: 'John Doe' };
    const result = { userId: 1 };

    it('should successfully create a user', async () => {
      mockUserService.createUser.mockResolvedValue(result);
      expect(await controller.create(createUserDto)).toEqual(result);
      expect(service.createUser).toHaveBeenCalledWith(createUserDto);
    });

    describe('follow', () => {
      it('should successfully create a follow', async () => {
        const userId = 1;
        const followerId = 2;
        const result = { message: 'Successfully completed the operation.' };

        mockUserService.followUser.mockResolvedValue(result);
        expect(await controller.follow(userId, followerId)).toEqual(result);
        expect(service.followUser).toHaveBeenCalledWith(userId, followerId);
      });
    });
  });

  describe('add Friend', () => {
    it('should successfully add a friend', async () => {
      const userId = 1;
      const friendId = 3;
      const result = { message: 'Friendship added' };

      mockUserService.addFriend.mockResolvedValue(result);
      expect(await controller.addFriendship(userId, friendId)).toEqual(result);
      expect(service.addFriend).toHaveBeenCalledWith(userId, friendId);
    });
  });
});
