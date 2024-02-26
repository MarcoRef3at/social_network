import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { getModelToken } from '@nestjs/sequelize';
import { Post } from '../models/post.model';
import { User } from '../models/user.model';
import { Like } from '../models/like.model';
import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';

describe('PostService', () => {
  let service: PostService;

  const mockPostRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    count: jest.fn(),
  };

  const mockUserRepository = {
    findAll: jest.fn(),
  };

  const mockLikeRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    destroy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        { provide: getModelToken(Post), useValue: mockPostRepository },
        { provide: getModelToken(User), useValue: mockUserRepository },
        { provide: getModelToken(Like), useValue: mockLikeRepository },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createPost', () => {
    it('should successfully create a post', async () => {
      const userId = 1;
      const text = 'Hello World';
      const visibility = 'public';
      const post = { userId, text, visibility };
      mockPostRepository.create.mockResolvedValue(post);

      await expect(
        service.createPost(userId, text, visibility),
      ).resolves.toEqual(post);
      expect(mockPostRepository.create).toHaveBeenCalledWith(post);
    });

    it('should throw BadRequestException if user does not exist', async () => {
      const userId = 999;
      const text = 'Hello World';
      const visibility = 'private';
      mockPostRepository.create.mockRejectedValue({
        name: 'SequelizeForeignKeyConstraintError',
      });

      await expect(
        service.createPost(userId, text, visibility),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getVisiblePostsForUser', () => {
    it('should return visible posts for a user', async () => {
      const userId = 1;
      const mockPosts = [
        {
          id: 1,
          text: 'Test post',
          createdAt: new Date(),
          author: { fullName: 'John Doe' },
        },
      ];
      const totalRecords = mockPosts.length;
      const pagination = { limit: 10, page: 1, offset: 0 };
      mockPostRepository.findAll.mockResolvedValue(mockPosts);
      mockUserRepository.findAll.mockResolvedValue([
        {
          id: userId,
          friends: [{ id: 2 }],
          followings: [{ id: 3 }],
        },
      ]);
      mockPostRepository.count.mockResolvedValue(totalRecords);

      const expectedPosts = mockPosts.map((post) => ({
        id: post.id,
        text: post.text,
        postedOn: post.createdAt,
        userFullName: post.author.fullName,
      }));

      const expectedResponse = {
        data: expectedPosts,
        pagination: {
          currentPage: 1,
          nextPage: null,
          totalPages: 1,
          totalRecords: 1,
        },
      };
      await expect(
        service.getVisiblePostsForUser(userId, pagination),
      ).resolves.toEqual(expectedResponse);
    });
  });

  describe('likePost', () => {
    it('should successfully like a post', async () => {
      const userId = 1;
      const postId = 2;
      mockPostRepository.findOne.mockResolvedValue({
        id: postId,
        visibility: 'public',
        userId: 3,
      });
      mockLikeRepository.findOne.mockResolvedValue(null);

      await expect(service.likePost(userId, postId)).resolves.toEqual({
        message: 'Post liked successfully.',
      });
      expect(mockLikeRepository.create).toHaveBeenCalledWith({
        userId,
        postId,
      });
    });

    it('should throw BadRequestException if post does not exist or not visible', async () => {
      const userId = 1;
      const postId = 2;
      mockPostRepository.findOne.mockResolvedValue(null);

      await expect(service.likePost(userId, postId)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if user already liked the post', async () => {
      const userId = 1;
      const postId = 2;
      mockLikeRepository.findOne.mockResolvedValue({ userId, postId });

      await expect(service.likePost(userId, postId)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('unlikePost', () => {
    it('should successfully remove a like from a post', async () => {
      const userId = 1;
      const postId = 2;
      const mockLike = { userId, postId, destroy: jest.fn() };
      mockLikeRepository.findOne.mockResolvedValue(mockLike);

      await expect(service.unlikePost(userId, postId)).resolves.toEqual({
        message: 'Like removed successfully.',
      });
      expect(mockLike.destroy).toHaveBeenCalled();
    });

    it('should throw BadRequestException if like does not exist', async () => {
      const userId = 1;
      const postId = 2;
      mockLikeRepository.findOne.mockResolvedValue(null);

      await expect(service.unlikePost(userId, postId)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
