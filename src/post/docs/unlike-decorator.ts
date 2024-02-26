import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

const UnlikePostResponses = {
  summary: 'Unlike a post',
  unlikePostSuccess: {
    description: 'The post has been unliked successfully',
    example: {
      message: 'Post unliked successfully.',
    },
  },
  unlikePostBadRequest: {
    description: 'The request to unlike a post was invalid',
    example: {
      message: 'Bad Request',
    },
  },
  unlikePostInternalServerError: {
    description: 'Internal server error',
    example: {
      message: 'Internal Server Error',
    },
  },
};

export function ApiUnlikePostDocs() {
  return applyDecorators(
    ApiTags('posts'),
    ApiOperation({
      summary: UnlikePostResponses.summary,
      description: 'Allows a user to unlike a post they previously liked.',
    }),
    ApiOkResponse({
      description: UnlikePostResponses.unlikePostSuccess.description,
      schema: { example: UnlikePostResponses.unlikePostSuccess.example },
    }),
    ApiBadRequestResponse({
      description: UnlikePostResponses.unlikePostBadRequest.description,
      schema: { example: UnlikePostResponses.unlikePostBadRequest.example },
    }),
    ApiInternalServerErrorResponse({
      description:
        UnlikePostResponses.unlikePostInternalServerError.description,
      schema: {
        example: UnlikePostResponses.unlikePostInternalServerError.example,
      },
    }),
  );
}
