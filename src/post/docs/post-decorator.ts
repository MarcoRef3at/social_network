import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

const PostResponses = {
  summary: 'Create a new post',
  createPostSuccess: {
    description: 'The post has been created successfully',
    example: {
      postId: 10,
    },
  },
  createPostBadRequest: {
    description: 'The post request was invalid',
    example: {
      message: 'Bad Request',
    },
  },
  createPostInternalServerError: {
    description: 'Internal server error',
    example: {
      message: 'Internal Server Error',
    },
  },
};

export function ApiPostDocs() {
  return applyDecorators(
    ApiTags('posts'),
    ApiOperation({
      summary: PostResponses.summary,
      description:
        'Allows a user to create a post with specified visibility (public or private).',
    }),
    ApiOkResponse({
      description: PostResponses.createPostSuccess.description,
      schema: { example: PostResponses.createPostSuccess.example },
    }),
    ApiBadRequestResponse({
      description: PostResponses.createPostBadRequest.description,
      schema: { example: PostResponses.createPostBadRequest.example },
    }),
    ApiInternalServerErrorResponse({
      description: PostResponses.createPostInternalServerError.description,
      schema: {
        example: PostResponses.createPostInternalServerError.example,
      },
    }),
  );
}
