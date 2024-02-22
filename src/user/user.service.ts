import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { UserFollows } from 'src/models/userFollows.model';
import { User } from '../models/user.model';
import { CreateUserDto } from './dto/create-user.dto';
import { UserFriends } from 'src/models/userFriends.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(UserFollows)
    private userFollowsModel: typeof UserFollows,
    @InjectModel(UserFriends)
    private userFriendsModel: typeof UserFriends,
  ) {}

  private async validateUsersExistence(user1Id: number, user2Id: number) {
    const usersExists = await this.userModel.findAll({
      where: {
        id: {
          [Op.or]: [user1Id, user2Id],
        },
      },
    });
    if (usersExists.length < 2) {
      const errorMessage = 'One or both users do not exist.';
      throw new HttpException(
        { message: 'Bad Request', messageDetails: errorMessage },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = new this.userModel(createUserDto);
    return user.save();
  }

  async followUser(userId: number, followerId: number): Promise<any> {
    await this.validateUsersExistence(userId, followerId);

    if (userId === followerId) {
      throw new HttpException(
        {
          message: 'Bad Request',
          messageDetails: "You can't follow yourself.",
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const exists = await this.userFollowsModel.findOne({
      where: { userId, followerId },
    });

    if (exists) {
      throw new HttpException(
        {
          message: 'Bad Request',
          messageDetails: 'You are already following this user.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.userFollowsModel.create({
      userId,
      followerId,
    });
    return { message: 'Successfully completed the operation.' };
  }

  async addFriend(userId: number, friendId: number): Promise<any> {
    await this.validateUsersExistence(userId, friendId);

    if (userId === friendId) {
      throw new HttpException(
        {
          message: 'Bad Request',
          messageDetails: 'Users cannot be friends with themselves.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const existingFriendship = await this.userFriendsModel.findOne({
      where: {
        [Op.or]: [
          { userId, friendId },
          { userId: friendId, friendId: userId },
        ],
      },
    });

    if (existingFriendship) {
      throw new HttpException(
        {
          message: 'Bad Request',
          messageDetails: 'Users are already friends.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.userFriendsModel.create({ userId, friendId });

    return { message: 'Successfully completed the operation.' };
  }
}
