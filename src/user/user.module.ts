import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserController } from './user.controller';
import { UserService } from './user.service';

import { UserFollows } from 'src/models/userFollows.model';
import { UserFriends } from 'src/models/userFriends.model';
import { User } from '../models/user.model';
@Module({
  imports: [SequelizeModule.forFeature([User, UserFollows, UserFriends])],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
