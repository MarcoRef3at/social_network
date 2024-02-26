import { applyDecorators } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

const WallResponses = {
  summary: 'Get user wall',
  getUserWallSuccess: {
    description:
      'A list of all the posts made by the user, their friends, and people they follow, sorted by timestamp descending',
    example: {
      data: [
        {
          text: 'Hello world!',
          postedOn: '2022-08-22T01:02:03.456Z',
          userFullName: 'John Doe',
        },
      ],
      pagination: {
        currentPage: 1,
        nextPage: 2,
        totalPages: 2,
        totalRecords: 3,
      },
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
    ApiQuery({
      name: 'page',
      required: false,
      type: 'number',
      description:
        'The page number to retrieve (default value is 1 if not provided)',
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: 'number',
      description:
        'The number of items per page (default value is 10 if not provided)',
    }),
  );
}
