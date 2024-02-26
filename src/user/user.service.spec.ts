import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/sequelize';
import { User } from '../models/user.model';
import { UserFollows } from '../models/userFollows.model';
import { UserFriends } from '../models/userFriends.model';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;

  const mockUserRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
  };

  const mockUserFollowsRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
  };

  const mockUserFriendsRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getModelToken(User), useValue: mockUserRepository },
        {
          provide: getModelToken(UserFollows),
          useValue: mockUserFollowsRepository,
        },
        {
          provide: getModelToken(UserFriends),
          useValue: mockUserFriendsRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should successfully create a user', async () => {
      const createUserDto = { fullName: 'John Doe' };
      const expectedResponse = { userId: 1 };
      mockUserRepository.create.mockResolvedValue({ id: 1 });
      await expect(service.createUser(createUserDto)).resolves.toEqual(
        expectedResponse,
      );
      expect(mockUserRepository.create).toHaveBeenCalledWith(createUserDto);
    });

    it('should throw an exception if database operation fails', async () => {
      const createUserDto = { fullName: 'John Doe' };
      mockUserRepository.create.mockRejectedValue(
        new Error('Internal Server Error'),
      );

      await expect(service.createUser(createUserDto)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('followUser', () => {
    const userId = 1;
    const followerId = 2;

    it('should successfully create a follow relationship', async () => {
      mockUserRepository.findAll.mockResolvedValue([{ id: 1 }, { id: 2 }]);
      mockUserFollowsRepository.findOne.mockResolvedValue(null);
      mockUserFollowsRepository.create.mockResolvedValue({
        userId,
        followerId,
      });

      await expect(service.followUser(userId, followerId)).resolves.toEqual({
        message: 'Successfully completed the operation.',
      });
      expect(mockUserFollowsRepository.create).toHaveBeenCalledWith({
        userId,
        followerId,
      });
    });

    describe('addFriend', () => {
      const userId = 1;
      const friendId = 3;

      it('should successfully add a friend', async () => {
        mockUserRepository.findAll.mockResolvedValue([{ id: 1 }, { id: 2 }]);
        mockUserFriendsRepository.findOne.mockResolvedValue(null);
        mockUserFriendsRepository.create.mockResolvedValue({});

        await expect(service.addFriend(userId, friendId)).resolves.toEqual({
          message: 'Successfully completed the operation.',
        });
        expect(mockUserFriendsRepository.create).toHaveBeenCalledWith({
          userId,
          friendId,
        });
      });
      it('should throw an exception if one or both users do not exist', async () => {
        const userId = 1;
        const followerId = 2;

        mockUserRepository.findAll.mockResolvedValue([]);

        await expect(service.followUser(userId, followerId)).rejects.toThrow(
          new HttpException(
            {
              message: 'Bad Request',
              messageDetails: 'One or both users do not exist.',
            },
            HttpStatus.BAD_REQUEST,
          ),
        );
      });

      it('should throw an exception when a user tries to follow themselves', async () => {
        const userId = 1;

        mockUserRepository.findAll.mockResolvedValue([{ id: 1 }, { id: 2 }]);

        await expect(service.followUser(userId, userId)).rejects.toThrow(
          new HttpException(
            {
              message: 'Bad Request',
              messageDetails: "You can't follow yourself.",
            },
            HttpStatus.BAD_REQUEST,
          ),
        );
      });

      it('should throw an exception if the follower is already following the user', async () => {
        const userId = 1;
        const followerId = 2;

        // Assuming both users exist
        mockUserRepository.findAll.mockResolvedValue([{}, {}]);

        // Simulate that the follow relationship already exists
        mockUserFollowsRepository.findOne.mockResolvedValue({
          userId,
          followerId,
        });

        await expect(service.followUser(userId, followerId)).rejects.toThrow(
          new HttpException(
            {
              message: 'Bad Request',
              messageDetails: 'You are already following this user.',
            },
            HttpStatus.BAD_REQUEST,
          ),
        );
      });
    });
  });
});
