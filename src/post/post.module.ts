import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Like } from '../models/like.model';
import { Post } from '../models/post.model';
import { User } from '../models/user.model';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [SequelizeModule.forFeature([Post, User, Like])],
  providers: [PostService],
  controllers: [PostController],
})
export class PostModule {}
