import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { ApiPostDocs } from './docs/post-decorator';
import { ApiWallDocs } from './docs/wall-decorator';

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
}
