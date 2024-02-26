import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { ApiPostDocs } from './docs/post-decorator';
import { ApiWallDocs } from './docs/wall-decorator';
import { ApiLikePostDocs } from './docs/like-decorator';
import { ApiUnlikePostDocs } from './docs/unlike-decorator';

@Controller('')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('posts')
  @HttpCode(HttpStatus.OK)
  @ApiPostDocs()
  async create(
    @Body() createPostDto: CreatePostDto,
  ): Promise<{ postId: number }> {
    const post = await this.postService.createPost(
      createPostDto.userId,
      createPostDto.text,
      createPostDto.visibility,
    );
    return {
      postId: post.id,
    };
  }

  @Get('walls/:userId')
  @ApiWallDocs()
  async getWall(@Param('userId', ParseIntPipe) userId: number): Promise<any> {
    return await this.postService.getVisiblePostsForUser(userId);
  }

  @Post(':postId/like/:userId')
  @ApiLikePostDocs()
  async likePost(
    @Param('postId', ParseIntPipe) postId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<any> {
    return this.postService.likePost(userId, postId);
  }

  @Delete(':postId/like/:userId')
  @ApiUnlikePostDocs()
  async unlikePost(
    @Param('postId', ParseIntPipe) postId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<any> {
    return this.postService.unlikePost(userId, postId);
  }
}
