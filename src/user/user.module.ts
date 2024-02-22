import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserFollows } from 'src/models/userFollows.model';
import { User } from '../models/user.model';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [SequelizeModule.forFeature([User, UserFollows])],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
