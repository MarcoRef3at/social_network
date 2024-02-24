import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { User } from 'src/models/user.model';
import { Post } from '../models/post.model';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post)
    private postModel: typeof Post,
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async createPost(
    userId: number,
    text: string,
    visibility: 'public' | 'private',
  ): Promise<Post> {
    try {
      const post = new this.postModel({
        userId,
        text,
        visibility,
      });
      console.log('hiiii');

      return await post.save();
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

  async getVisiblePostsForUser(userId: number): Promise<any[]> {
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
          attributes: ['fullName'],
        },
      ],
    });
    return posts.map((post) => ({
      id: post.id,
      text: post.text,
      postedOn: post.createdAt,
      userFullName: post.user.fullName,
    }));
  }
  async getAllowedIds(userId: number) {
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
}
