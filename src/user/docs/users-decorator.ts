import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

const CreateUserResponses = {
  summary: 'Create a new user',
  createUserSuccess: {
    description: 'The user has been successfully created.',
    example: {
      userId: 1,
    },
  },
  createUserBadRequest: {
    description: 'Invalid request data',
    example: {
      message: 'FullName is required',
    },
  },
  createUserInternalServerError: {
    description: 'Internal server error',
    example: {
      message: 'Bad Request',
      messageDetails: [
        'fullName has wrong value undefined, fullName must be a string, fullName should not be empty',
      ],
    },
  },
};

export function ApiCreateUserDocs() {
  return applyDecorators(
    ApiTags('users'),
    ApiOperation({ summary: CreateUserResponses.summary }),
    ApiOkResponse({
      description: CreateUserResponses.createUserSuccess.description,
      schema: { example: CreateUserResponses.createUserSuccess.example },
    }),
    ApiBadRequestResponse({
      description: CreateUserResponses.createUserBadRequest.description,
      schema: { example: CreateUserResponses.createUserBadRequest.example },
    }),
    ApiInternalServerErrorResponse({
      description:
        CreateUserResponses.createUserInternalServerError.description,
      schema: {
        example: CreateUserResponses.createUserInternalServerError.example,
      },
    }),
  );
}
