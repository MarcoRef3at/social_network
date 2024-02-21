export const CreateUserResponses = {
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
