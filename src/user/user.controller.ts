import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '../models/user.model';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUserResponses } from './user-api-docs';
import { UserService } from './user.service';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: CreateUserResponses.summary })
  @ApiOkResponse({
    description: CreateUserResponses.createUserSuccess.description,
    schema: { example: CreateUserResponses.createUserSuccess.example },
  })
  @ApiBadRequestResponse({
    description: CreateUserResponses.createUserBadRequest.description,
    schema: { example: CreateUserResponses.createUserBadRequest.example },
  })
  @ApiInternalServerErrorResponse({
    description: CreateUserResponses.createUserInternalServerError.description,
    schema: {
      example: CreateUserResponses.createUserInternalServerError.example,
    },
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<any> {
    try {
      const user: User = await this.userService.createUser(createUserDto);
      return { userId: user.id };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Internal Server Error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
