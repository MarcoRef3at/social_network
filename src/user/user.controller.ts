import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from '../models/user.model';
import { ApiFollowUserDocs } from './docs/follow-decorator';
import { ApiFriendUserDocs } from './docs/friend-decorator';
import { ApiCreateUserDocs } from './docs/users-decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiTags('users')
  @ApiCreateUserDocs()
  async create(@Body() createUserDto: CreateUserDto): Promise<any> {
    try {
      const user: User = await this.userService.createUser(createUserDto);
      return { userId: user.id };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Internal Server Error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post(':userId/followers/:followerId')
  @HttpCode(HttpStatus.OK)
  @ApiFollowUserDocs()
  async follow(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('followerId', ParseIntPipe) followerId: number,
  ): Promise<any> {
    return this.userService.followUser(userId, followerId);
  }

  @Post(':userId/friends/:friendId')
  @HttpCode(HttpStatus.OK)
  @ApiFriendUserDocs()
  async addFriendship(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('friendId', ParseIntPipe) friendId: number,
  ): Promise<any> {
    return this.userService.addFriend(userId, friendId);
  }
}
