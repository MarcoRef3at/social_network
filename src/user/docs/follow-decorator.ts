import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

const FollowUserResponses = {
  summary: 'Adds a follower to a user',
  followUserSuccess: {
    description: 'Successfully added the follower relation',
    example: {
      message: 'Successfully completed the operation.',
    },
  },
  followUserBadRequest: {
    description: 'The request was invalid',
    example: {
      message: 'Bad Request',
    },
  },
  followUserInternalServerError: {
    description: 'Internal server error',
    example: {
      message: 'Internal Server Error',
    },
  },
};
export function ApiFollowUserDocs() {
  return applyDecorators(
    ApiTags('network'),
    ApiOperation({
      summary: FollowUserResponses.summary,
      description:
        'Adds the user with id - followerId as a follower to the user with the userId passed',
    }),
    ApiOkResponse({
      description: FollowUserResponses.followUserSuccess.description,
      schema: { example: FollowUserResponses.followUserSuccess.example },
    }),
    ApiBadRequestResponse({
      description: FollowUserResponses.followUserBadRequest.description,
      schema: { example: FollowUserResponses.followUserBadRequest.example },
    }),
    ApiInternalServerErrorResponse({
      description:
        FollowUserResponses.followUserInternalServerError.description,
      schema: {
        example: FollowUserResponses.followUserInternalServerError.example,
      },
    }),
    ApiParam({
      name: 'userId',
      required: true,
      description: 'ID of the user',
      type: 'integer',
    }),
    ApiParam({
      name: 'followerId',
      required: true,
      description: 'ID of the follower',
      type: 'integer',
    }),
  );
}
