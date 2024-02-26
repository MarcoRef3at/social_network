import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { User } from '../models/user.model';
import { Post } from '../models/post.model';
import { Like } from '../models/like.model';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post)
    private postModel: typeof Post,
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(Like)
    private likeModel: typeof Like,
  ) {}

  async createPost(
    userId: number,
    text: string,
    visibility: 'public' | 'private',
  ): Promise<Post> {
    try {
      return await this.postModel.create({
        userId,
        text,
        visibility,
      });
    } catch (error) {
      if (error.name === 'SequelizeForeignKeyConstraintError') {
        throw new BadRequestException(`User with ID ${userId} does not exist.`);
      }
      throw new HttpException(
        { message: 'Bad Request', messageDetails: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async getAllowedIds(userId: number) {
    const friendsAndFollowed = await this.userModel.findAll({
      where: { id: userId },
      include: [
        {
          model: User,
          as: 'friends',
          required: false,
          attributes: ['id'],
        },
        {
          model: User,
          as: 'followings',
          required: false,
          attributes: ['id'],
        },
      ],
    });

    let ids = [userId];

    friendsAndFollowed.forEach((user) => {
      if (user.friends) {
        ids = ids.concat(user.friends.map((friend) => friend.id));
      }
      if (user.followings) {
        ids = ids.concat(user.followings.map((following) => following.id));
      }
    });
    return ids;
  }

  async getVisiblePostsForUser(
    userId: number,
    pagination?: { limit: number; offset: number; page: number },
  ): Promise<any> {
    const ids = await this.getAllowedIds(userId);

    const posts = await this.postModel.findAll({
      where: {
        [Op.or]: [{ userId: { [Op.in]: ids } }, { visibility: 'public' }],
      },
      attributes: ['text', 'createdAt'],
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['fullName'],
        },
      ],
      ...pagination,
    });

    const data = posts.map((post) => ({
      id: post.id,
      text: post.text,
      postedOn: post.createdAt,
      userFullName: post.author.fullName,
    }));

    const responsePagination = await this.getResponsePagination(
      ids,
      pagination,
    );

    return { data, pagination: responsePagination };
  }

  async likePost(userId: number, postId: number): Promise<any> {
    const post = await this.postModel.findOne({ where: { id: postId } });
    if (!post) {
      throw new BadRequestException('Post does not exist');
    }
    if (post?.visibility === 'private' && post?.userId !== userId) {
      const visiblePostsIds = await this.getAllowedIds(userId);
      if (!visiblePostsIds.includes(postId)) {
        throw new BadRequestException('Post is not visible to the user.');
      }
    }

    const alreadyLiked = await this.likeModel.findOne({
      where: { userId, postId },
    });
    if (alreadyLiked) {
      throw new BadRequestException('User has already liked this post.');
    }

    try {
      await this.likeModel.create({ userId, postId });
      return { message: 'Post liked successfully.' };
    } catch (error) {
      if (error.name === 'SequelizeForeignKeyConstraintError') {
        throw new BadRequestException(
          `User or Post with the provided ID does not exist.`,
        );
      }
      throw new HttpException(
        { message: 'Bad Request', messageDetails: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async unlikePost(userId: number, postId: number): Promise<any> {
    const like = await this.likeModel.findOne({ where: { userId, postId } });
    if (!like) {
      throw new BadRequestException('Like does not exist.');
    }

    await like.destroy();
    return { message: 'Like removed successfully.' };
  }

  private async getResponsePagination(
    ids: number[],
    pagination: { limit: number; offset: number; page: number },
  ) {
    const totalRecords = await this.postModel.count({
      where: {
        [Op.or]: [{ userId: { [Op.in]: ids } }, { visibility: 'public' }],
      },
    });

    const currentPage = pagination.page || 1;
    const totalPages = Math.ceil(totalRecords / (pagination.limit || 10));
    const hasNextPage = currentPage < totalPages;
    const nextPage = hasNextPage ? currentPage + 1 : null;
    return {
      currentPage,
      nextPage,
      totalPages,
      totalRecords,
    };
  }
}
