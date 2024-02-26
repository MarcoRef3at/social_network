import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';

describe('PostController', () => {
  let controller: PostController;
  let service: PostService;

  const mockPostService = {
    createPost: jest.fn(),
    getVisiblePostsForUser: jest.fn(),
    likePost: jest.fn(),
    unlikePost: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [{ provide: PostService, useValue: mockPostService }],
    }).compile();

    controller = module.get<PostController>(PostController);
    service = module.get<PostService>(PostService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should call createPost on service with correct parameters', async () => {
      const createPostDto: CreatePostDto = {
        userId: 1,
        text: 'Hello World',
        visibility: 'public',
      };
      const result = { postId: 1 };

      mockPostService.createPost.mockResolvedValue({ id: result.postId });

      expect(await controller.create(createPostDto)).toEqual(result);
      expect(service.createPost).toHaveBeenCalledWith(
        createPostDto.userId,
        createPostDto.text,
        createPostDto.visibility,
      );
    });
  });

  describe('getWall', () => {
    it('should call getVisiblePostsForUser on service with correct parameters', async () => {
      const userId = 1;
      const posts = [{ postId: 1, text: 'Post 1' }];

      mockPostService.getVisiblePostsForUser.mockResolvedValue(posts);

      expect(await controller.getWall(userId)).toEqual(posts);
      expect(service.getVisiblePostsForUser).toHaveBeenCalledWith(userId);
    });
  });

  describe('likePost', () => {
    it('should call likePost on service with correct parameters', async () => {
      const postId = 1;
      const userId = 1;
      const result = { message: 'Post liked successfully.' };

      mockPostService.likePost.mockResolvedValue(result);

      expect(await controller.likePost(postId, userId)).toEqual(result);
      expect(service.likePost).toHaveBeenCalledWith(userId, postId);
    });
  });

  describe('unlikePost', () => {
    it('should call unlikePost on service with correct parameters', async () => {
      const postId = 1;
      const userId = 1;
      const result = { message: 'Like removed successfully.' };

      mockPostService.unlikePost.mockResolvedValue(result);

      expect(await controller.unlikePost(postId, userId)).toEqual(result);
      expect(service.unlikePost).toHaveBeenCalledWith(userId, postId);
    });
  });
});
