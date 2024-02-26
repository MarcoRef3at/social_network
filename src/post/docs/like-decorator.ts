import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

const LikePostResponses = {
  summary: 'Like a post',
  likePostSuccess: {
    description: 'The post has been liked successfully',
    example: {
      message: 'Post liked successfully.',
    },
  },
  likePostBadRequest: {
    description: 'The request to like a post was invalid',
    example: {
      message: 'Bad Request',
    },
  },
  likePostInternalServerError: {
    description: 'Internal server error',
    example: {
      message: 'Internal Server Error',
    },
  },
};

export function ApiLikePostDocs() {
  return applyDecorators(
    ApiTags('posts'),
    ApiOperation({
      summary: LikePostResponses.summary,
      description: 'Allows a user to like a post.',
    }),
    ApiOkResponse({
      description: LikePostResponses.likePostSuccess.description,
      schema: { example: LikePostResponses.likePostSuccess.example },
    }),
    ApiBadRequestResponse({
      description: LikePostResponses.likePostBadRequest.description,
      schema: { example: LikePostResponses.likePostBadRequest.example },
    }),
    ApiInternalServerErrorResponse({
      description: LikePostResponses.likePostInternalServerError.description,
      schema: {
        example: LikePostResponses.likePostInternalServerError.example,
      },
    }),
  );
}
