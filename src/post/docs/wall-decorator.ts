import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';

const WallResponses = {
  summary: 'Get user wall',
  getUserWallSuccess: {
    description:
      'A list of all the posts made by the user, their friends, and people they follow, sorted by timestamp descending',
    example: [
      {
        text: 'Hello world!',
        postedOn: '2022-08-22T01:02:03.456Z',
        userFullName: 'John Doe',
      },
    ],
  },
  getUserWallBadRequest: {
    description: 'The timeline request was invalid',
    example: {
      message: 'Bad Request',
    },
  },
  getUserWallInternalServerError: {
    description: 'Internal server error',
    example: {
      message: 'Internal Server Error',
    },
  },
};

export function ApiWallDocs() {
  return applyDecorators(
    ApiTags('social'),
    ApiOperation({
      summary: WallResponses.summary,
      description:
        'Retrieves a list of posts visible to the user on their wall, including their own, their friends’, and public posts from the people they follow.',
    }),
    ApiOkResponse({
      description: WallResponses.getUserWallSuccess.description,
      schema: { example: WallResponses.getUserWallSuccess.example },
    }),
    ApiBadRequestResponse({
      description: WallResponses.getUserWallBadRequest.description,
      schema: { example: WallResponses.getUserWallBadRequest.example },
    }),
    ApiInternalServerErrorResponse({
      description: WallResponses.getUserWallInternalServerError.description,
      schema: {
        example: WallResponses.getUserWallInternalServerError.example,
      },
    }),
    ApiParam({
      name: 'userId',
      required: true,
      description: 'ID of the user whose wall is being requested',
      type: 'integer',
    }),
  );
}
