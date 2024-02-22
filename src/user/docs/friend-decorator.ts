import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

const FriendUserResponses = {
  summary: 'Adds a friend to a user',
  friendUserSuccess: {
    description: 'Successfully added the friendship relation',
    example: {
      message: 'Successfully completed the operation.',
    },
  },
  friendUserBadRequest: {
    description: 'The request was invalid',
    example: {
      message: 'Bad Request',
    },
  },
  friendUserInternalServerError: {
    description: 'Internal server error',
    example: {
      message: 'Internal Server Error',
    },
  },
};

export function ApiFriendUserDocs() {
  return applyDecorators(
    ApiTags('network'),
    ApiOperation({
      summary: FriendUserResponses.summary,
      description:
        'Establishes a mutual friend relationship between two users, making them both friends and followers of each other.',
    }),
    ApiOkResponse({
      description: FriendUserResponses.friendUserSuccess.description,
      schema: { example: FriendUserResponses.friendUserSuccess.example },
    }),
    ApiBadRequestResponse({
      description: FriendUserResponses.friendUserBadRequest.description,
      schema: { example: FriendUserResponses.friendUserBadRequest.example },
    }),
    ApiInternalServerErrorResponse({
      description:
        FriendUserResponses.friendUserInternalServerError.description,
      schema: {
        example: FriendUserResponses.friendUserInternalServerError.example,
      },
    }),
    ApiParam({
      name: 'userId',
      required: true,
      description: 'ID of the user initiating the friendship',
      type: 'integer',
    }),
    ApiParam({
      name: 'friendId',
      required: true,
      description: 'ID of the user to become friends with',
      type: 'integer',
    }),
  );
}
