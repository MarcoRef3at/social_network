import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { UserFollows } from 'src/models/userFollows.model';
import { User } from '../models/user.model';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(UserFollows)
    private userFollowsModel: typeof UserFollows,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = new this.userModel(createUserDto);
    return user.save();
  }

  async followUser(userId: number, followerId: number): Promise<any> {
    const usersExists = await this.userModel.findAll({
      where: {
        id: {
          [Op.or]: [userId, followerId],
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
}
