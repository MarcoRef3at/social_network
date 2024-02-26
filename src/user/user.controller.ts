import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
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
  create(@Body() createUserDto: CreateUserDto): Promise<any> {
    return this.userService.createUser(createUserDto);
  }

  @Post(':userId/followers/:followerId')
  @HttpCode(HttpStatus.OK)
  @ApiFollowUserDocs()
  follow(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('followerId', ParseIntPipe) followerId: number,
  ): Promise<any> {
    return this.userService.followUser(userId, followerId);
  }

  @Post(':userId/friends/:friendId')
  @HttpCode(HttpStatus.OK)
  @ApiFriendUserDocs()
  addFriendship(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('friendId', ParseIntPipe) friendId: number,
  ): Promise<any> {
    return this.userService.addFriend(userId, friendId);
  }
}
